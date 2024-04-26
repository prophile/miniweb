import { $useCurrentDispatcher } from "./useCurrentDispatcher";

export function $useProvideContext(context: symbol, value: any): void {
  const dispatcher = $useCurrentDispatcher();
  dispatcher.$useProvideContext(context, value);
}
