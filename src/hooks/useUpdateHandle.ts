import { $useCurrentDispatcher } from "./useCurrentDispatcher";

export function $useUpdateHandle(): (isPriority: boolean, callback?: () => void) => void {
  const dispatcher = $useCurrentDispatcher();
  return dispatcher.$useUpdateHandle();
}
