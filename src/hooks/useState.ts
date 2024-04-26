import { useShared } from "./useShared";
import { $useAutoUpdateHandle } from "./useAutoUpdateHandle";

export function useState<T>(initial: T | (() => T)): [T, (value: T | ((old: T) => T)) => void] {
  const store = useShared(() => {
    if (typeof initial === "function") {
      return { value: (initial as () => T)() };
    } else {
      return { value: initial };
    }
  });
  const updateHandle = $useAutoUpdateHandle();

  function setState(newValue: T | ((old: T) => T)) {
    store.value =
      typeof newValue === "function" ? (newValue as (old: T) => T)(store.value) : newValue;
    updateHandle();
  }

  return [store.value, setState];
}