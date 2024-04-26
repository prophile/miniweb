import { $useCurrentDispatcher } from "./useCurrentDispatcher";

export function useLifecycleCallback(
  point: "insert" | "layout" | "effect",
  callback: null | (() => void | (() => void)),
): void {
  const dispatcher = $useCurrentDispatcher();
  dispatcher.useLifecycleCallback(point, callback);
}