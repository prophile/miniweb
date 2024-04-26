import { useShared } from './useShared';
import { useMonitor } from './useMonitor';

export function useMemo<T>(fn: () => T, dependencies?: any[]): T {
  const store = useShared(() => ({ value: fn() }));
  if (useMonitor(false, dependencies)) {
    store.value = fn();
  }
  return store.value;
}