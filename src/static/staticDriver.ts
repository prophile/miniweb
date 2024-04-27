import type { Driver } from "../driver";

export type StaticElement = {
  type: "element";
  name: string;
  attributes: Record<string, string>;
  children: StaticNode[];
  parent: StaticElement | null;
};

export type StaticText = {
  type: "text";
  text: string;
  parent: StaticElement | null;
};

type StaticMarker = {
  type: "marker";
  parent: StaticElement | null;
};

export type StaticNode = StaticElement | StaticText | StaticMarker;

export class StaticDriver implements Driver<StaticElement, StaticText, null, never> {
  placeEnd(parent: StaticElement) {
    return {
      addText(text: string) {
        const node: StaticText = {
          type: "text",
          text,
          parent,
        };
        parent.children.push(node);
        return node;
      },
      addElement(type: string) {
        const element: StaticElement = {
          type: "element",
          name: type,
          attributes: {},
          children: [],
          parent,
        };
        parent.children.push(element);
        return element;
      },
      ossify() {
        return this;
      },
    };
  }

  placeBefore(element: StaticElement | StaticText) {
    const parent = element.parent;
    if (!parent) {
      throw new Error("Element has no parent");
    }
    const index = parent.children.indexOf(element);
    return {
      addText(text: string) {
        const node: StaticText = {
          type: "text",
          text,
          parent,
        };
        parent.children.splice(index, 0, node);
        return node;
      },
      addElement(type: string) {
        const newElement: StaticElement = {
          type: "element",
          name: type,
          attributes: {},
          children: [],
          parent,
        };
        parent.children.splice(index, 0, newElement);
        return newElement;
      },
      ossify() {
        const marker: StaticMarker = {
          type: "marker",
          parent,
        };
        parent.children.splice(index, 0, marker);
        return {
          addText(text: string) {
            const markerIndex = parent.children.indexOf(marker);
            const node: StaticText = {
              type: "text",
              text,
              parent,
            };
            parent.children.splice(markerIndex, 0, node);
            return node;
          },
          addElement(type: string) {
            const markerIndex = parent.children.indexOf(marker);
            const newElement: StaticElement = {
              type: "element",
              name: type,
              attributes: {},
              children: [],
              parent,
            };
            parent.children.splice(markerIndex, 0, newElement);
            return newElement;
          },
          ossify() {
            return this;
          },
        };
      },
    };
  }

  remove(node: StaticElement | StaticText) {
    const parent = node.parent;
    if (!parent) {
      throw new Error("Node has no parent");
    }
    const index = parent.children.indexOf(node);
    parent.children.splice(index, 1);
  }

  updateText(text: StaticText, newText: string) {
    text.text = newText;
  }

  updateStyles(element: StaticElement, styles: Record<string, string>) {
    Object.assign(element.attributes, styles);
  }

  updateClasses(element: StaticElement, added: string[], removed: string[]) {
    const classes = new Set(element.attributes.class?.split(" ") ?? []);
    for (const className of added) {
      classes.add(className);
    }
    for (const className of removed) {
      classes.delete(className);
    }
    if (classes.size === 0) {
      delete element.attributes.class;
      return;
    }
    element.attributes.class = Array.from(classes).join(" ");
  }

  setAttribute(element: StaticElement, attr: string, value: string) {
    element.attributes[attr] = value;
  }

  removeAttribute(element: StaticElement, attr: string) {
    delete element.attributes[attr];
  }

  addListener(element: StaticElement, event: string, listener: (event: never) => void) {
    // Events are never fired in static rendering, so we can safely just not do anything here
  }

  removeListener(element: StaticElement, event: string, listener: (event: never) => void) {
    // Events are never fired in static rendering, so we can safely just not do anything here
  }

  getNativeHandle(element: StaticElement) {
    return null;
  }

  isText(node: StaticText | StaticElement): node is StaticText {
    return node.type === "text";
  }
}
