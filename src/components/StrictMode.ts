// This is provided for compatibility only, and has no effect.

import type { MiniNode } from "../component";

export interface StrictModeProps {
  children: MiniNode;
}

export default function StrictMode(props: StrictModeProps) {
  return props.children;
}
