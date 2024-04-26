import { $useCurrentDispatcher } from "./useCurrentDispatcher";

export function useShared<T>(init: (key: string) => T): T {
  const dispatcher = $useCurrentDispatcher();
  return dispatcher.useShared(init);
}