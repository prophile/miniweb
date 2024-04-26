import { useLifecycleEffect } from "./useLifecycleEffect";

export function useInsertionEffect(callback: () => void, dependencies?: any[]) {
  useLifecycleEffect("insert", callback, dependencies);
}
