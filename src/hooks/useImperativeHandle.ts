import { useLayoutEffect } from "./useLayoutEffect";

export function useImperativeHandle<T>(
  ref: { current: T | null } | ((instance: T | null) => void),
  createHandle: () => T,
  dependencies?: any[],
) {
  const effectiveDependencies = dependencies
    ? [ref, createHandle, ...dependencies]
    : [ref, createHandle];
  useLayoutEffect(() => {
    if (typeof ref === "function") {
      ref(createHandle());
      return () => {
        ref(null);
      };
    } else {
      ref.current = createHandle();
      return () => {
        ref.current = null;
      };
    }
  }, effectiveDependencies);
}
