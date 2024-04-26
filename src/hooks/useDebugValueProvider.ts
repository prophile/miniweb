import { $useCurrentDispatcher } from "./useCurrentDispatcher";

export function $useDebugValueProvider(provider: () => any): void {
  const dispatcher = $useCurrentDispatcher();
  if (dispatcher.$useDebugValueProvider) {
    dispatcher.$useDebugValueProvider(provider);
  }
}
