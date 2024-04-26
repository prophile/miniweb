import { useShared } from "./useShared";

let idPrefix: string = "";

export function runWithIdPrefix<T>(prefix: string | null | undefined, fn: () => T): T {
  prefix = prefix || "";
  const oldPrefix = idPrefix;
  idPrefix = prefix;
  try {
    return fn();
  } finally {
    idPrefix = oldPrefix;
  }
}

export function useId(): string {
  const autoKey = useShared((key: string) => key);
  return `${idPrefix}${autoKey}`;
}