import { $useCurrentDispatcher } from "./useCurrentDispatcher";

export function $useReadContext(context: symbol): any {
  const dispatcher = $useCurrentDispatcher();
  return dispatcher.$useReadContext(context);
}
