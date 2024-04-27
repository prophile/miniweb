let transitionCount: number = 0;

export function startTransition<T>(fn: () => T): T {
  transitionCount++;
  try {
    return fn();
  } finally {
    transitionCount--;
  }
}

export function isTransitioning(): boolean {
  return transitionCount > 0;
}
