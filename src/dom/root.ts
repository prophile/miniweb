import { MiniNode, MiniElement } from "../component";
import { createRootComponentInstance } from "../instance";
import type { Driver } from "../driver";
import { HTMLDOMDriver } from "./domDriver";
import { LogDriver } from "../logDriver";

interface ErrorInfo {
  cause?: Error;
  errorInfo: MiniElement[];
}

interface CreateRootOptions {
  onRecoverableError?(info: ErrorInfo): void;
  identifierPrefix?: string;
  onCaughtError?(error: Error): void;
  onUncaughtError?(error: Error): void;
}

function ReactRoot(props: { value: MiniNode }) {
  return props.value;
}

const __LOG__: boolean = false;

export function createRoot(root: HTMLElement, options?: CreateRootOptions) {
  let driver: Driver<HTMLElement, Text, HTMLElement, Event> = new HTMLDOMDriver();

  if (__LOG__) {
    driver = new LogDriver(driver);
  }

  let isUnmounted = false;

  // TODO: Run with the id prefix

  // Clear the root
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }

  const rootInstance = createRootComponentInstance(driver, driver.placeEnd(root), ReactRoot, {
    value: null,
  });

  return {
    render(node: MiniNode) {
      if (isUnmounted) {
        throw new Error("Root has been unmounted");
      }
      (rootInstance.element.props as Record<string, any>).value = node;
      rootInstance.runSync();
    },
    unmount() {
      if (isUnmounted) {
        return;
      }
      rootInstance.unmount();
      isUnmounted = true;
    },
  };
}
