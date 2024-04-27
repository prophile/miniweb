import type { MiniElement, MiniNode, FunctionalComponent } from "../component";
import type { Driver, Place } from "../driver";

import { Text } from "../component";
import { nodesToElements } from "../nodesToElements";
import { unpackProps } from "../unpackProps";

import { runInDispatcher } from "../hookDispatcher";
import { StaticHookDispatcher } from "./staticHookDispatcher";

export function renderStatic<DElement, DText>(
  driver: Driver<DElement, DText, any, any>,
  node: MiniNode,
  place: Place<DElement, DText>,
  context: Map<symbol, any> = new Map(),
): void {
  const elements = nodesToElements([node]);

  for (const element of elements) {
    if (element.type == Text) {
      place.addText(element.props.text);
    } else if (typeof element.type === "string") {
      // Native element
      const newElement = place.addElement(element.type);
      // Set its attributes
      const { classes, styles, attributes } = unpackProps(element.props);
      driver.updateClasses(newElement, classes, []);
      if (Object.keys(styles).length > 0) {
        driver.updateStyles(newElement, styles);
      }
      for (const [key, value] of Object.entries(attributes)) {
        driver.setAttribute(newElement, key, value);
      }
      // Recurse
      renderStatic(driver, element.props.children, driver.placeEnd(newElement));
    } else if (typeof element.type === "function") {
      // TODO: Error boundary handling
      const dispatcher = new StaticHookDispatcher(context);
      const subnode = runInDispatcher(dispatcher, () =>
        (element.type as FunctionalComponent)(element.props, null),
      );
      // Merge `context` and `dispatcher.exportedContext`
      const mergedContext = new Map([...context, ...dispatcher.exportedContext]);
      renderStatic(driver, subnode, place, mergedContext);
    }
  }
}
