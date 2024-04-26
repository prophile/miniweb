import type { MiniNode } from "../component";
import { $useErrorBoundary } from "../hooks/useErrorBoundary";
import { useState } from "../hooks/useState";

export type ErrorBoundaryProps =
  | {
      children: MiniNode;
      fallback: MiniNode;
    }
  | {
      children: MiniNode;
      fallbackRender: (error: Error, resetErrorBoundary: () => void) => MiniNode;
    };

const NotTripped: unique symbol = Symbol("NotTripped");

export default function ErrorBoundary(props: ErrorBoundaryProps) {
  const error = $useErrorBoundary();
  const [tripNode, setTripNode] = useState<MiniNode | typeof NotTripped>(NotTripped);

  if (error instanceof Promise) {
    // We aren't a boundary for suspension, just errors
    throw error;
  }

  if (tripNode !== NotTripped) {
    return tripNode;
  }

  if ("fallback" in props) {
    // Hard fallback
    if (error !== null) {
      return props.fallback;
    } else {
      return props.children;
    }
  } else {
    // Detailed fallback with reset
    if (error !== null) {
      const tripOutput = props.fallbackRender(error, () => {
        setTripNode(NotTripped);
      });
      setTripNode(tripOutput);
    } else {
      return props.children;
    }
  }
}
