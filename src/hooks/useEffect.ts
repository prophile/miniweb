import { useLifecycleEffect } from "./useLifecycleEffect";

export function useEffect(callback: () => void, dependencies?: any[]) {
  useLifecycleEffect("effect", callback, dependencies);
}
