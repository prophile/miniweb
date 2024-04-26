import type { Driver } from './driver';

export class DOMDriver implements Driver<HTMLElement, Text, HTMLElement, Event> {
  addText(parent: HTMLElement, place: Node | null, text: string) {
    const node = document.createTextNode(text);
    if (place === null) {
      parent.appendChild(node);
    } else {
      parent.insertBefore(node, place);
    }
    return node;
  }

  addElement(
    parent: HTMLElement,
    place: Node | null,
    type: string
  ) {
    const node = document.createElement(type);
    if (place === null) {
      parent.appendChild(node);
    } else {
      parent.insertBefore(node, place);
    }
    return node;
  }

  placeEnd(parent: HTMLElement) {
    return {
      addText(text: string) {
        const node = document.createTextNode(text);
        parent.appendChild(node);
        return node;
      },
      addElement(type: string) {
        const node = document.createElement(type);
        parent.appendChild(node);
        return node;
      },
      ossify() {
        return this;
      },
    };
  }

  placeBefore(element: HTMLElement | Text) {
    const parent = element.parentElement;
    if (!parent) {
      throw new Error('Element has no parent');
    }
    return {
      addText(text: string) {
        const node = document.createTextNode(text);
        parent.insertBefore(node, element);
        return node;
      },
      addElement(type: string) {
        const node = document.createElement(type);
        parent.insertBefore(node, element);
        return node;
      },
      ossify() {
        const dummyNode = document.createTextNode('');
        parent.insertBefore(dummyNode, element);
        return {
          addText(text: string) {
            const node = document.createTextNode(text);
            parent.insertBefore(node, dummyNode);
            return node;
          },
          addElement(type: string) {
            const node = document.createElement(type);
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

  remove(node: Text | HTMLElement) {
    node.remove();
  }

  updateText(text: Text, newText: string) {
    text.data = newText;
  }

  updateStyles(element: HTMLElement, styles: Record<string, string>) {
    for (const [key, value] of Object.entries(styles)) {
      element.style.setProperty(key, value);
    }
  }

  updateClasses(element: HTMLElement, added: string[], removed: string[]) {
    for (const className of added) {
      element.classList.add(className);
    }
    for (const className of removed) {
      element.classList.remove(className);
    }
  }

  setAttribute(element: HTMLElement, attr: string, value: string) {
    element.setAttribute(attr, value);
  }

  removeAttribute(element: HTMLElement, attr: string) {
    element.removeAttribute(attr);
  }

  addListener(element: HTMLElement, event: string, listener: (event: Event) => void) {
    element.addEventListener(event, listener);
  }

  removeListener(element: HTMLElement, event: string, listener: (event: Event) => void) {
    element.removeEventListener(event, listener);
  }

  getNativeHandle(element: HTMLElement) {
    return element;
  }

  readText(text: Text) {
    return text.data;
  }

  readStyles(element: HTMLElement) {
    const styles: Record<string, string> = {};
    for (let i = 0; i < element.style.length; i++) {
      const key = element.style.item(i);
      const value = element.style.getPropertyValue(key);
      styles[key] = value;
    }
    return styles;
  }

  readClasses(element: HTMLElement) {
    return Array.from(element.classList);
  }

  readAttribute(element: HTMLElement, attr: string) {
    return element.getAttribute(attr);
  }

  readType(element: HTMLElement) {
    return element.tagName.toLowerCase();
  }

  readChildren(element: HTMLElement) {
    return Array.from(element.childNodes) as (HTMLElement | Text)[];
  }

  isText(node: Text | HTMLElement): any {
    return node instanceof Text;
  }
}