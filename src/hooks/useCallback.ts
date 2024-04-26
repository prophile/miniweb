import { useMemo } from './useMemo';

export function useCallback<T extends (...args: any[]) => any>(fn: T, dependencies?: any[]): T {
  return useMemo(() => fn, dependencies);
}