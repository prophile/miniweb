import type { Driver, Place } from "./driver";

class LogPlace<DElement, DText> implements Place<DElement, DText> {
  place: Place<DElement, DText>;
  logOssify: boolean = true;

  constructor(place: Place<DElement, DText>, logOssify: boolean = true) {
    this.place = place;
    this.logOssify = logOssify;
  }

  addText(text: string): DText {
    console.log("addText", text);
    return this.place.addText(text);
  }

  addElement(type: string): DElement {
    console.log("addElement", type);
    return this.place.addElement(type);
  }

  ossify(): Place<DElement, DText> {
    if (this.logOssify) {
      console.log("ossify", this.place);
    }
    return new LogPlace(this.place.ossify(), false);
  }
}

export class LogDriver<DElement, DText, DNative, DEvent> {
  driver: Driver<DElement, DText, DNative, DEvent>;

  constructor(driver: Driver<DElement, DText, DNative, DEvent>) {
    this.driver = driver;
  }

  placeEnd(parent: DElement): Place<DElement, DText> {
    return new LogPlace(this.driver.placeEnd(parent));
  }

  placeBefore(element: DElement | DText): Place<DElement, DText> {
    return new LogPlace(this.driver.placeBefore(element));
  }

  remove(node: DText | DElement): void {
    console.log("remove", node);
    this.driver.remove(node);
  }

  updateText(text: DText, newText: string): void {
    console.log("updateText", text, newText);
    this.driver.updateText(text, newText);
  }

  updateStyles(element: DElement, styles: Record<string, string>): void {
    console.log("updateStyles", element, styles);
    this.driver.updateStyles(element, styles);
  }

  updateClasses(element: DElement, added: string[], removed: string[]): void {
    console.log("updateClasses", element, added, removed);
    this.driver.updateClasses(element, added, removed);
  }

  setAttribute(element: DElement, attr: string, value: string): void {
    console.log("setAttribute", element, attr, value);
    this.driver.setAttribute(element, attr, value);
  }

  removeAttribute(element: DElement, attr: string): void {
    console.log("removeAttribute", element, attr);
    this.driver.removeAttribute(element, attr);
  }

  addListener(element: DElement, event: string, listener: (event: DEvent) => void): void {
    console.log("addListener", element, event, listener);
    this.driver.addListener(element, event, listener);
  }

  removeListener(element: DElement, event: string, listener: (event: DEvent) => void): void {
    console.log("removeListener", element, event, listener);
    this.driver.removeListener(element, event, listener);
  }

  getNativeHandle(element: DElement): DNative {
    console.log("getNativeHandle", element);
    return this.driver.getNativeHandle(element);
  }

  isText(node: any): any {
    return this.driver.isText(node);
  }
}
