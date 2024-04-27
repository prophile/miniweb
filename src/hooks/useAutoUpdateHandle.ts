import { $useUpdateHandle } from "./useUpdateHandle";
import { isTransitioning } from "../transitions";

export function $useAutoUpdateHandle(): (callback?: () => void) => void {
  const updateHandle = $useUpdateHandle();
  return (callback: () => void) => updateHandle(isTransitioning(), callback);
}
