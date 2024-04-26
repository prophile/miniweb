import { useState } from './useState';
import { useLayoutEffect } from './useLayoutEffect';

export function useSyncExternalStore<T>(
  subscribe: (callback: () => void) => () => void,
  getSnapshot: () => T,
  getServerSnapshot?: () => T,
) {
  const [state, setState] = useState(getSnapshot);
  // TODO: Do something with the server snapshot
  useLayoutEffect(() => {
    return subscribe(() => {
      const newValue = getSnapshot();
      setState(newValue);
    });
  }, [subscribe, getSnapshot]);

  return state;
}