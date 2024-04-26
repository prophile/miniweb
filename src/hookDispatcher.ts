export interface HookDispatcher {
  /* These are the essential hooks and semihooks that are used by a driver.
   * All other hooks are derived from these. */
  useShared<T>(init: (key: string) => T): T;
  $useUpdateHandle(): (isPriority: boolean, callback?: () => void) => void;
  useLifecycleCallback(
    point: "insert" | "layout" | "effect",
    callback: null | (() => void | (() => void)),
  ): void;
  $useReadContext(context: symbol): any;
  $useProvideContext(context: symbol, value: any): void;
  $useErrorBoundary(): Error | Promise<any> | null;
  $useDebugValueProvider?(provider: () => any): void;
}

// Global state for the hook dispatcher
let currentDispatcher: HookDispatcher | null = null;

export function runInDispatcher<T>(dispatcher: HookDispatcher, fn: () => T): T {
  const prevDispatcher = currentDispatcher;
  currentDispatcher = dispatcher;
  try {
    return fn();
  } finally {
    currentDispatcher = prevDispatcher;
  }
}

export function $useCurrentDispatcher(): HookDispatcher {
  if (currentDispatcher === null) {
    throw new Error("Hooks can only be used inside a component");
  }
  return currentDispatcher;
}
