export type { Ref, FunctionalComponent, Component, MiniNode, MiniElement } from "./component";

import { Fragment } from "./component";
import { createElement } from "./createElement";
import { createRoot } from "./dom/root";
import { tpl } from "./tpl";
import { render } from "./compat";

import {
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
} from "./hooks/index";

import { createContext, useContext } from "./context";

import { memo, forwardRef } from "./highorder";

import ErrorBoundary from "./components/ErrorBoundary";

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
};

export default React;
