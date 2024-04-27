import type { Driver } from "../driver";

export abstract class GenericDOMDriver<E extends Element> implements Driver<E, Text, E, Event> {
  abstract createElement(type: string): E;

  placeEnd(parent: E) {
    const $this = this;
    return {
      addText(text: string) {
        const node = document.createTextNode(text);
        parent.appendChild(node);
        return node;
      },
      addElement(type: string) {
        const node = $this.createElement(type);
        parent.appendChild(node);
        return node;
      },
      ossify() {
        return this;
      },
    };
  }

  placeBefore(element: E | Text) {
    const $this = this;
    const parent = element.parentElement;
    if (!parent) {
      throw new Error("Element has no parent");
    }
    return {
      addText(text: string) {
        const node = document.createTextNode(text);
        parent.insertBefore(node, element);
        return node;
      },
      addElement(type: string) {
        const node = $this.createElement(type);
        parent.insertBefore(node, element);
        return node;
      },
      ossify() {
        const dummyNode = document.createTextNode("");
        parent.insertBefore(dummyNode, element);
        return {
          addText(text: string) {
            const node = document.createTextNode(text);
            parent.insertBefore(node, dummyNode);
            return node;
          },
          addElement(type: string) {
            const node = $this.createElement(type);
            parent.insertBefore(node, dummyNode);
            return node;
          },
          ossify() {
            return this;
          },
        };
      },
    };
  }

  remove(node: Text | E) {
    node.remove();
  }

  updateText(text: Text, newText: string) {
    text.data = newText;
  }

  abstract updateStyles(element: E, styles: Record<string, string>): void;

  updateClasses(element: E, added: string[], removed: string[]) {
    for (const className of added) {
      element.classList.add(className);
    }
    for (const className of removed) {
      element.classList.remove(className);
    }
  }

  setAttribute(element: E, attr: string, value: string) {
    element.setAttribute(attr, value);
  }

  removeAttribute(element: E, attr: string) {
    element.removeAttribute(attr);
  }

  abstract addListener(element: E, event: string, listener: (event: Event) => void): void;
  abstract removeListener(element: E, event: string, listener: (event: Event) => void): void;

  getNativeHandle(element: E) {
    return element;
  }

  isText(node: Text | E): any {
    return node instanceof Text;
  }
}

export class HTMLDOMDriver extends GenericDOMDriver<HTMLElement> {
  createElement(type: string) {
    return document.createElement(type);
  }

  updateStyles(element: HTMLElement, styles: Record<string, string>) {
    for (const [key, value] of Object.entries(styles)) {
      element.style.setProperty(key, value);
    }
  }

  addListener(element: HTMLElement, event: string, listener: (event: Event) => void) {
    element.addEventListener(event, listener);
  }

  removeListener(element: HTMLElement, event: string, listener: (event: Event) => void) {
    element.removeEventListener(event, listener);
  }
}
