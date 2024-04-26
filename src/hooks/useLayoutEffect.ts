import { useLifecycleEffect } from "./useLifecycleEffect";

export function useLayoutEffect(callback: () => void, dependencies?: any[]) {
  useLifecycleEffect("layout", callback, dependencies);
}