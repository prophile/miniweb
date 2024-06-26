import type { MiniNode } from "../component";
import { createRoot } from "./root";

export function render(node: MiniNode, root: HTMLElement) {
  const rootInstance = createRoot(root);
  rootInstance.render(node);
  return rootInstance;
}
