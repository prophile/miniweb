// High-order components

import { FunctionalComponent } from "./component";
import { useMemo } from "./hooks/index";

export function memo(Component: FunctionalComponent): FunctionalComponent {
  return function Memoized(props, ref) {
    // Dependencies are alternating keys and values of props, plus the ref
    // The keys are sorted to ensure that the order of dependencies is stable
    const dependencies = Object.keys(props)
      .sort()
      .flatMap((key) => [key, props[key]]);
    dependencies.push(ref);

    return useMemo(() => Component(props, ref), dependencies);
  };
}

export function forwardRef(Component: FunctionalComponent): FunctionalComponent {
  // forwardRef is a no-op in this implementation
  return Component;
}
