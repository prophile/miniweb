export interface Place<DElement, DText> {
  addText(text: string): DText;
  addElement(type: string): DElement;
  ossify(): Place<DElement, DText>;
}

export interface Driver<DElement, DText, DNative, DEvent> {
  // Places
  placeEnd(parent: DElement): Place<DElement, DText>;
  placeBefore(element: DElement | DText): Place<DElement, DText>;

  // Removal
  remove(node: DElement | DText): void;

  // Altering properties
  updateText(text: DText, newText: string): void;
  updateStyles(element: DElement, styles: Record<string, string>): void;
  updateClasses(element: DElement, added: string[], removed: string[]): void;
  setAttribute(element: DElement, attr: string, value: string): void;
  removeAttribute(element: DElement, attr: string): void;

  // Event listeners
  addListener(element: DElement, event: string, listener: (event: DEvent) => void): void;
  removeListener(element: DElement, event: string, listener: (event: DEvent) => void): void;

  // Native handles (for refs)
  getNativeHandle(element: DElement): DNative;

  isText(node: DText): true;
  isText(node: DElement): false;
}