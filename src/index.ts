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
} from "./hooks";

import { createContext, useContext } from "./context";

import { memo, forwardRef } from "./highorder";

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
};

export default React;
