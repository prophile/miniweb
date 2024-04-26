export interface SubscribeStore<T> {
  subscribe(callback: () => void): () => void;
  getSnapshot(): T;
  write(newValue: T): void;
}

export function createSubscribeStore<T>(initialValue: T): SubscribeStore<T> {
  let value = initialValue;
  let listeners: (() => void)[] = [];

  return {
    subscribe(callback) {
      listeners.push(callback);
      return () => {
        listeners = listeners.filter(l => l !== callback);
      };
    },
    getSnapshot() {
      return value;
    },
    write(newValue) {
      if (Object.is(value, newValue)) {
        return;
      }
      value = newValue;
      for (const listener of listeners) {
        listener();
      }
    }
  };
}