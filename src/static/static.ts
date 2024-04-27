import type { MiniNode } from "../component";
import type { StaticNode, StaticText, StaticElement } from "./staticDriver";
import { StaticDriver } from "./staticDriver";
import { renderStatic } from "./staticRender";

const selfClosingTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function staticNodeBuildHTML(node: StaticNode, buffer: string[]) {
  switch (node.type) {
    case "text":
      buffer.push(node.text);
      return;
    case "element":
      const attrs = Object.entries(node.attributes)
        .map(([key, value]) => ` ${key}="${value}"`)
        .join("");
      if (selfClosingTags.has(node.name)) {
        buffer.push(`<${node.name}${attrs}>`);
        return;
      } else {
        buffer.push(`<${node.name}${attrs}>`);
        for (const child of node.children) {
          staticNodeBuildHTML(child, buffer);
        }
        buffer.push(`</${node.name}>`);
        return;
      }
    case "marker":
      return;
  }
}

export function renderStaticHTML(node: MiniNode): string {
  const driver = new StaticDriver();
  const rootNodes: StaticNode[] = [];

  const placeRoot = {
    addText(text: string) {
      const node: StaticText = { type: "text", text, parent: null };
      rootNodes.push(node);
      return node;
    },
    addElement(type: string) {
      const element: StaticElement = {
        type: "element",
        name: type,
        attributes: {},
        children: [],
        parent: null,
      };
      rootNodes.push(element);
      return element;
    },
    ossify() {
      return this;
    },
  };

  renderStatic(driver, node, placeRoot);

  const buffer: string[] = [];
  for (const node of rootNodes) {
    staticNodeBuildHTML(node, buffer);
  }
  return buffer.join("");
}
