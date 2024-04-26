import { $useUpdateHandle } from "./useUpdateHandle";
import { useShared } from "./useShared";

export function useOptimistic<T, Opt>(
  state: T,
  applyOptimistic: (state: T, optimistic: Opt) => T,
): [T, (optimistic: Opt) => void] {
  const updateHandle = $useUpdateHandle();

  interface Store {
    state: T;
    optimistic: T;
  }

  const store = useShared<Store>(() => ({ state: state, optimistic: state }));

  function addOptimistic(optimistic: Opt) {
    const oldOptimistic = store.optimistic;
    const newOptimistic = applyOptimistic(store.state, optimistic);
    if (!Object.is(oldOptimistic, newOptimistic)) {
      store.optimistic = newOptimistic;
      updateHandle(true);
    }
  }

  if (Object.is(store.state, state)) {
    return [store.optimistic, addOptimistic];
  } else {
    store.state = state;
    store.optimistic = state;
    return [state, addOptimistic];
  }
}
