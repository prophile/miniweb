import { useState } from "./useState";

export function useReducer<T, A>(
  reducer: (state: T, action: A) => T,
  initial: T | (() => T),
): [T, (action: A) => void] {
  const [state, setState] = useState(initial);

  function dispatch(action: A) {
    setState((old) => reducer(old, action));
  }

  return [state, dispatch];
}
