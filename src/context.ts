import type { MiniNode } from "./component";

import { createSubscribeStore } from "./subscribeStore";
import { useShared } from "./hooks/useShared";
import { $useReadContext } from "./hooks/useReadContext";
import { $useProvideContext } from "./hooks/useProvideContext";
import { useEffect, useLayoutEffect } from "./hooks/index";
import { $useAutoUpdateHandle } from "./hooks/useAutoUpdateHandle";

interface Context<T> {
  Provider: (props: { value: T; children: MiniNode }) => MiniNode;
  Consumer: (props: { children: (value: T) => MiniNode }) => MiniNode;

  useContext(): T;
}

export function useContext<T>(context: Context<T>): T {
  return context.useContext();
}

export function createContext<T>(defaultValue?: T): Context<T> {
  const name = Symbol("context");

  function Provider(props: { value: T; children: MiniNode }) {
    const store = useShared(() => createSubscribeStore(props.value));

    useEffect(() => {
      store.write(props.value);
    }, [props.value]);

    $useProvideContext(name, store);

    return props.children;
  }

  function useContext(): T {
    const store = $useReadContext(name);
    if (!store) {
      if (defaultValue === undefined) {
        throw new Error("No context value");
      }
      return defaultValue;
    }
    const updateHandle = $useAutoUpdateHandle();
    // Subscribe to the store
    useLayoutEffect(() => {
      return store.subscribe(() => {
        updateHandle();
      });
    });
    return store.getSnapshot();
  }

  function Consumer(props: { children: (value: T) => MiniNode }) {
    const value = useContext();
    return props.children(value);
  }

  return { Provider, Consumer, useContext };
}
