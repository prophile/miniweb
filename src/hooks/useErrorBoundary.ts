import { $useCurrentDispatcher } from "./useCurrentDispatcher";

export function $useErrorBoundary(): Error | Promise<any> | null {
  const dispatcher = $useCurrentDispatcher();
  return dispatcher.$useErrorBoundary();
}
