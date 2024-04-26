import { useShared, $useUpdateHandle, useLifecycleCallback, $useDebugValueProvider } from './hookDispatcher';

let transitionCount: number = 0;
let idPrefix: string = '';

export function startTransition<T>(fn: () => T): T {
  transitionCount++;
  try {
    return fn();
  } finally {
    transitionCount--;
  }
}

export function runWithIdPrefix<T>(prefix: string | null | undefined, fn: () => T): T {
  prefix = prefix || '';
  const oldPrefix = idPrefix;
  idPrefix = prefix;
  try {
    return fn();
  } finally {
    idPrefix = oldPrefix;
  }
}

export function $useAutoUpdateHandle(): (callback?: () => void) => void {
  const updateHandle = $useUpdateHandle();
  return (callback: () => void) => updateHandle(transitionCount === 0, callback);
}

export function useState<T>(initial: T | (() => T)): [T, (value: T | ((old: T) => T)) => void] {
  const store = useShared(() => {
    if (typeof initial === 'function') {
      return {value: (initial as () => T)()};
    } else {
      return {value: initial};
    }
  });
  const updateHandle = $useAutoUpdateHandle();

  function setState(newValue: T | ((old: T) => T)) {
    store.value = typeof newValue === 'function' ? (newValue as (old: T) => T)(store.value) : newValue;
    updateHandle();
  }

  return [store.value, setState];
}

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

function useMonitor(initial: boolean, dependencies?: any[]): boolean {
  const store = useShared(() => ({isInitial: initial, dependencies}));
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

export function useRef<T>(initial: T): {current: T};
export function useRef<T>(initial: null): {current: T | null};
export function useRef<T>(): {current: T | null};
export function useRef<T>(initial?: T): {current: T | null} {
  return useShared(() => ({current: initial || null}));
}

export function useMemo<T>(fn: () => T, dependencies?: any[]): T {
  const store = useShared(() => ({value: fn()}));
  if (useMonitor(false, dependencies)) {
    store.value = fn();
  }
  return store.value;
}

export function useCallback<T extends (...args: any[]) => any>(fn: T, dependencies?: any[]): T {
  return useMemo(() => fn, dependencies);
}

function useLifecycleEffect(point: 'insert' | 'layout' | 'effect', callback: () => void, dependencies?: any[]) {
  const shouldRun = useMonitor(true, dependencies);
  useLifecycleCallback(point, shouldRun ? callback : null);
}

export function useEffect(callback: () => void, dependencies?: any[]) {
  useLifecycleEffect('effect', callback, dependencies);
}

export function useLayoutEffect(callback: () => void, dependencies?: any[]) {
  useLifecycleEffect('layout', callback, dependencies);
}

export function useInsertionEffect(callback: () => void, dependencies?: any[]) {
  useLifecycleEffect('insert', callback, dependencies);
}

// useContext is tied to <Context> and is implemented along with context

export function useImperativeHandle<T>(ref: {current: T | null} | ((instance: T | null) => void), createHandle: () => T, dependencies?: any[]) {
  const effectiveDependencies = dependencies ? [ref, createHandle, ...dependencies] : [ref, createHandle];
  useLayoutEffect(() => {
    if (typeof ref === 'function') {
      ref(createHandle());
      return () => {
        ref(null);
      };
    } else {
      ref.current = createHandle();
      return () => {
        ref.current = null;
      };
    }
  }, effectiveDependencies);
}

export function useDebugValue<T>(value: T, formatter?: (value: T) => any) {
  if (formatter) {
    $useDebugValueProvider(() => formatter(value));
  } else {
    $useDebugValueProvider(() => value);
  }
}

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
}

export function useOptimistic<T, Opt>(state: T, applyOptimistic: (state: T, optimistic: Opt) => T): [T, (optimistic: Opt) => void] {
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

export function useId(): string {
  const autoKey = useShared((key: string) => key);
  return `${idPrefix}${autoKey}`;
}

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