import { useState } from './useState';
import { startTransition } from './transitions';

export function useTransition<T>(): [boolean, (callback: () => T) => T] {
  const [inTransition, setInTransition] = useState(false);

  function innerStartTransition<T>(fn: () => T): T {
    setInTransition(true);
    return startTransition(() => {
      try {
        return fn();
      } finally {
        setInTransition(false);
      }
    });
  }

  return [inTransition, innerStartTransition];
}