import { useShared } from "./useShared";

export function useRef<T>(initial: T): { current: T };
export function useRef<T>(initial: null): { current: T | null };
export function useRef<T>(): { current: T | null };
export function useRef<T>(initial?: T): { current: T | null } {
  return useShared(() => ({ current: initial || null }));
}