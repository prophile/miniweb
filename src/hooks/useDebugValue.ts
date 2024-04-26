import { $useDebugValueProvider } from "./useDebugValueProvider";

export function useDebugValue<T>(value: T, formatter?: (value: T) => any) {
  if (formatter) {
    $useDebugValueProvider(() => formatter(value));
  } else {
    $useDebugValueProvider(() => value);
  }
}