import { useShared } from './useShared';

export function useMonitor(initial: boolean, dependencies?: any[]): boolean {
  const store = useShared(() => ({ isInitial: initial, dependencies }));
  if (store.isInitial) {
    store.isInitial = false;
    return true;
  }

  // Compare dependencies
  if (!store.dependencies && !dependencies) {
    return true;
  }
  if (!store.dependencies && dependencies) {
    store.dependencies = dependencies;
    return true;
  }
  if (!dependencies && store.dependencies) {
    store.dependencies = undefined;
    return true;
  }
  if (store.dependencies.length !== dependencies.length) {
    store.dependencies = dependencies;
    return true;
  }
  for (let i = 0; i < dependencies.length; i++) {
    if (!Object.is(store.dependencies[i], dependencies[i])) {
      store.dependencies = dependencies;
      return true;
    }
  }

  return false;
}