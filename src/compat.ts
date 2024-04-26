import type { MiniNode } from "./component";
import { createRoot } from "./dom/root";

export function render(node: MiniNode, root: HTMLElement) {
  const rootInstance = createRoot(root);
  rootInstance.render(node);
  return rootInstance;
}
