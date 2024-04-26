import { useState } from './useState';
import { startTransition } from './transitions';

export function useDeferredValue<T>(value: T): T {
  const [deferredValue, setDeferredValue] = useState(() => value);
  if (Object.is(deferredValue, value)) {
    return value;
  } else {
    startTransition(() => {
      setDeferredValue(value);
    });
  }
  return deferredValue;
}
