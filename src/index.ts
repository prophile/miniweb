export type { Ref, FunctionalComponent, Component, MiniNode, MiniElement } from "./component";

import { Fragment } from "./component";
import { createElement } from "./createElement";
import { createRoot } from "./dom/root";
import { tpl } from "./tpl";
import { render } from "./dom/compat";

import { startTransition } from "./transitions";
import {
  useCallback,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useOptimistic,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "./hooks/index";

import { createContext, useContext } from "./context";

import { memo, forwardRef } from "./highorder";
import { flushSync } from "./taskQueue";

import ErrorBoundary from "./components/ErrorBoundary";
import StrictMode from "./components/StrictMode";

export {
  Fragment,
  createElement,
  createRoot,
  tpl,
  render,
  startTransition,
  useCallback,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useOptimistic,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  createContext,
  useContext,
  memo,
  forwardRef,
  ErrorBoundary,
  StrictMode,
  flushSync,
};

export const React = {
  Fragment,
  createElement,
  createRoot,
  tpl,
  render,
  startTransition,
  useCallback,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useOptimistic,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  createContext,
  useContext,
  memo,
  forwardRef,
  ErrorBoundary,
  StrictMode,
  flushSync,
};

export default React;
