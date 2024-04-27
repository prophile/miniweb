import type { MiniNode, MiniElement, FunctionalComponent } from "./component";
import type { HookDispatcher } from "./hookDispatcher";
import { runInDispatcher } from "./hookDispatcher";
import { Text } from "./component";

import { Driver, Place } from "./driver";
import { unpackProps } from "./unpackProps";
import { nodesToElements } from "./nodesToElements";
import { diff } from "./diff";
import { LifecycleRegistry } from "./lifecycleRegistry";
import { runAuto, runNonUrgent } from "./nonUrgentQueue";
import { startTransition } from "./transitions";

class TextInstance<DElement, DText> {
  parent: Instance<DElement, DText> | null;
  driver: Driver<DElement, DText, any, any>;
  target: DText;
  element: MiniElement & { type: typeof Text };
  currentText?: string;

  constructor(
    parent: Instance<DElement, DText> | null,
    driver: Driver<DElement, DText, any, any>,
    target: DText,
    element: MiniElement & { type: typeof Text },
  ) {
    this.parent = parent;
    this.driver = driver;
    this.target = target;
    this.element = element;
  }

  runSync() {
    if (this.currentText !== this.element.props.text) {
      this.driver.updateText(this.target, this.element.props.text);
      this.currentText = this.element.props.text;
    }
  }

  unmount() {
    this.driver.remove(this.target);
  }

  placeBefore(): Place<DElement, DText> {
    return this.driver.placeBefore(this.target);
  }
}

class ComponentInstance<DElement, DText> {
  parent: Instance<DElement, DText> | null;
  driver: Driver<DElement, DText, any, any>;
  place: Place<DElement, DText>;
  element: MiniElement & { type: FunctionalComponent };
  isErrorBoundary: boolean = false;
  state: Map<number, any> = new Map();
  providedContext: Record<symbol, any> = {};
  currentChildren: Instance<DElement, DText>[] = [];
  previousRender?: MiniNode;
  isUnmounted: boolean = false;
  effects: LifecycleRegistry = new LifecycleRegistry();
  layoutEffects: LifecycleRegistry = new LifecycleRegistry();
  insertEffects: LifecycleRegistry = new LifecycleRegistry();

  constructor(
    parent: Instance<DElement, DText> | null,
    driver: Driver<DElement, DText, any, any>,
    place: Place<DElement, DText>,
    element: MiniElement & { type: FunctionalComponent },
  ) {
    this.parent = parent;
    this.driver = driver;
    this.place = place;
    this.element = element;
  }

  private createHookDispatcher(interceptingError?: Error | Promise<any>): HookDispatcher {
    let stateIndex = 0;
    const $this = this;
    this.effects.prepare();
    this.layoutEffects.prepare();
    this.insertEffects.prepare();

    return {
      useShared<T>(init: (key: string) => T): T {
        const index = stateIndex++;
        const key = `shared-${index}`; // This isn't correct, it needs to be unique
        if (!$this.state.has(index)) {
          const value = init(key);
          $this.state.set(index, value);
          return value;
        } else {
          return $this.state.get(index);
        }
      },

      $useUpdateHandle(): (isPriority: boolean, callback?: () => void) => void {
        return (isPriority, callback) => {
          function doUpdate() {
            if ($this.isUnmounted) {
              return;
            }
            $this.runSync();
            callback?.();
          }

          if (isPriority) {
            queueMicrotask(doUpdate);
          } else {
            runNonUrgent(() => {
              startTransition(doUpdate);
            });
          }
        };
      },

      useLifecycleCallback(
        point: "insert" | "layout" | "effect",
        callback: null | (() => void | (() => void)),
      ): void {
        // Set the lifecycle
        const registry = {
          insert: $this.insertEffects,
          layout: $this.layoutEffects,
          effect: $this.effects,
        }[point];
        registry.useLifecycle(callback);
      },

      $useReadContext(context: symbol): any {
        let current: Instance<DElement, DText> | null = $this.parent;
        while (current) {
          if ("providedContext" in current && context in current.providedContext) {
            return current.providedContext[context];
          }
          current = current.parent;
        }
        return undefined;
      },

      $useProvideContext(context: symbol, value: any): void {
        $this.providedContext[context] = value;
      },

      $useErrorBoundary(): Error | Promise<any> | null {
        return interceptingError || null;
      },
    };
  }

  runSync() {
    // Evaluate the functional component
    const dispatcher = this.createHookDispatcher();

    const node = runInDispatcher(dispatcher, () =>
      this.element.type(this.element.props, this.element.ref),
    );

    if (node === this.previousRender) {
      return;
    }
    this.previousRender = node;

    const elements = nodesToElements([node]);
    if (this.isErrorBoundary) {
      try {
        this.currentChildren = syncChildren(this, this.currentChildren, elements, this.place);
      } catch (error) {
        // Re-run the component in error boundary mode
        const errorDispatcher = this.createHookDispatcher(error);
        const errorNode = runInDispatcher(errorDispatcher, () =>
          this.element.type(this.element.props, this.element.ref),
        );
        if (errorNode === this.previousRender) {
          return;
        }
        const errorElements = nodesToElements([errorNode]);
        this.currentChildren = syncChildren(this, this.currentChildren, errorElements, this.place);
      }
    } else {
      this.currentChildren = syncChildren(this, this.currentChildren, elements, this.place);
    }

    // Handle lifecycle effects
    if (this.insertEffects.mustExecute()) {
      queueMicrotask(() => {
        if (this.isUnmounted) {
          return;
        }
        this.insertEffects.execute();
      });
    }
    if (this.layoutEffects.mustExecute()) {
      queueMicrotask(() => {
        if (this.isUnmounted) {
          return;
        }
        this.layoutEffects.execute();
      });
    }
    if (this.effects.mustExecute()) {
      setTimeout(() => {
        if (this.isUnmounted) {
          return;
        }
        this.effects.execute();
      }, 0);
    }
  }

  unmount() {
    // Clean up lifecycle callbacks
    this.effects.runAllCleanups();
    this.layoutEffects.runAllCleanups();
    this.insertEffects.runAllCleanups();
    for (const child of this.currentChildren) {
      child.unmount();
    }
    this.isUnmounted = true;
  }

  placeBefore(): Place<DElement, DText> {
    if (this.currentChildren.length > 0) {
      return this.currentChildren[0].placeBefore();
    } else {
      return this.place;
    }
  }
}

class ElementInstance<DElement, DText> {
  parent: Instance<DElement, DText> | null;
  driver: Driver<DElement, DText, any, any>;
  target: DElement;
  element: MiniElement & { type: string };
  currentClasses: string[];
  currentStyles: Record<string, string>;
  currentAttributes: Record<string, string>;
  currentListeners: Record<string, (event: any) => void>;
  currentChildren: Instance<DElement, DText>[];

  constructor(
    parent: Instance<DElement, DText> | null,
    driver: Driver<DElement, DText, any, any>,
    target: DElement,
    element: MiniElement & { type: string },
  ) {
    this.parent = parent;
    this.driver = driver;
    this.target = target;
    this.element = element;
    this.currentClasses = [];
    this.currentStyles = {};
    this.currentAttributes = {};
    this.currentListeners = {};
    this.currentChildren = [];
  }

  runSync() {
    const { classes, styles, attributes, listeners } = unpackProps(this.element.props);

    // Synchronize ref
    if (this.element.ref) {
      this.element.ref(this.driver.getNativeHandle(this.target));
    }

    // Synchronize classes
    const addedClasses = classes.filter((c) => !this.currentClasses.includes(c));
    const removedClasses = this.currentClasses.filter((c) => !classes.includes(c));
    if (addedClasses.length > 0 || removedClasses.length > 0) {
      this.driver.updateClasses(this.target, addedClasses, removedClasses);
      this.currentClasses = classes;
    }

    // Synchronize styles
    // These are just a straight diff - if any style is different, we update it
    let stylesChanged = false;
    for (const [key, value] of Object.entries(styles)) {
      if (this.currentStyles[key] !== value) {
        stylesChanged = true;
        break;
      }
    }
    if (stylesChanged) {
      this.driver.updateStyles(this.target, styles);
      this.currentStyles = styles;
    }

    // Synchronize attributes
    for (const [key, value] of Object.entries(attributes)) {
      const currentValue = this.currentAttributes[key];
      if (currentValue !== value) {
        this.driver.setAttribute(this.target, key, value);
        this.currentAttributes[key] = value;
      }
    }
    // Remove any attributes that are no longer present
    for (const key of Object.keys(this.currentAttributes)) {
      if (!(key in attributes)) {
        this.driver.removeAttribute(this.target, key);
        delete this.currentAttributes[key];
      }
    }

    // Synchronize listeners
    for (const [key, value] of Object.entries(listeners)) {
      const currentValue = this.currentListeners[key];
      if (currentValue !== value) {
        if (currentValue) {
          this.driver.removeListener(this.target, key, currentValue);
        }
        this.driver.addListener(this.target, key, value);
        this.currentListeners[key] = value;
      }
    }
    for (const key of Object.keys(this.currentListeners)) {
      if (!(key in listeners)) {
        const currentValue = this.currentListeners[key];
        this.driver.removeListener(this.target, key, currentValue);
        delete this.currentListeners[key];
      }
    }

    // Synchronize children
    this.currentChildren = syncChildren(
      this,
      this.currentChildren,
      this.element.children,
      this.driver.placeEnd(this.target),
    );
  }

  unmount() {
    for (const child of this.currentChildren) {
      child.unmount();
    }
    this.driver.remove(this.target);
  }

  placeBefore(): Place<DElement, DText> {
    return this.driver.placeBefore(this.target);
  }
}

export type Instance<DElement, DText> =
  | TextInstance<DElement, DText>
  | ComponentInstance<DElement, DText>
  | ElementInstance<DElement, DText>;

export function createRootComponentInstance<DElement, DText>(
  driver: Driver<DElement, DText, any, any>,
  place: Place<DElement, DText>,
  component: FunctionalComponent,
  props?: Record<string, any>,
): ComponentInstance<DElement, DText> {
  props = props || {};
  const element = {
    type: component,
    props: props,
    key: null,
    ref: null,
    children: [],
  };
  return new ComponentInstance(null, driver, place, element);
}

function syncChildren<DElement, DText>(
  parent: Instance<DElement, DText>,
  previousChildren: Instance<DElement, DText>[],
  currentChildren: MiniElement[],
  appendPlace: Place<DElement, DText>,
): Instance<DElement, DText>[] {
  const driver = parent.driver;
  const diffResult = diff(
    currentChildren,
    previousChildren,
    (left: MiniElement, right: Instance<DElement, DText>) => {
      if (right instanceof TextInstance) {
        return left.type === Text;
      } else if (right instanceof ComponentInstance) {
        return left.type === right.element.type;
      } else {
        return left.type === right.element.type;
      }
    },
    (left: MiniElement) => left.key || null,
    (right: Instance<DElement, DText>) => right.element.key || null,
  );

  const newChildren: Instance<DElement, DText>[] = [];
  for (const result of diffResult) {
    if (result.type === "match") {
      // Synchronize the matched element
      result.right.element = result.left;
      runAuto(() => result.right.runSync());
      newChildren.push(result.right);
    } else if (result.type === "delete") {
      result.right.unmount();
    } else if (result.type === "insert") {
      const place = result.beforeRight ? result.beforeRight.placeBefore() : appendPlace;
      // Create the new element
      if (result.left.type === Text) {
        const textNode = place.addText(result.left.props.text);
        const instance = new TextInstance(parent, driver, textNode, result.left);
        newChildren.push(instance);
      } else if (typeof result.left.type === "string") {
        const element = place.addElement(result.left.type);
        const instance = new ElementInstance(
          parent,
          driver,
          element,
          result.left as MiniElement & { type: string },
        );
        // Element syncs we deliberately always do synchronously, so no runAuto here
        instance.runSync();
        newChildren.push(instance);
      } else {
        // Functional component
        const component = new ComponentInstance(
          parent,
          driver,
          place.ossify(),
          result.left as MiniElement & { type: FunctionalComponent },
        );
        runAuto(() => component.runSync());
        newChildren.push(component);
      }
    } else {
      throw new Error("Unexpected diff result");
    }
  }

  return newChildren;
}
