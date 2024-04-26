import { useMonitor } from "./useMonitor";
import { useLifecycleCallback } from "./useLifecycleCallback";

export function useLifecycleEffect(
  point: "insert" | "layout" | "effect",
  callback: () => void,
  dependencies?: any[],
) {
  const shouldRun = useMonitor(true, dependencies);
  useLifecycleCallback(point, shouldRun ? callback : null);
}