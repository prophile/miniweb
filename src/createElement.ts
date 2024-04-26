import type { Component, MiniNode, MiniElement } from './component';
import { Fragment, Text } from './component';

import { nodesToElements } from './nodesToElements';

export function createElement(
  type: Component,
  props: Record<string, any> | null,
  ...children: MiniNode[]
): MiniElement[] {
  // Normalize props
  if (props) {
    props = {...props};
  } else {
    props = {};
  }
  // If children exist in props, move them to the children array
  if (props.children) {
    children.push(...props.children);
    delete props.children;
  }
  // Normalize children
  const normalizedChildren = nodesToElements(children);
  // Pull out the key and ref from props
  const {key, ref, ...rest} = props;
  // If the type is specifically Fragment, verify that it's well-formed
  if (type === Fragment) {
    if (key !== null) {
      throw new Error('Fragment cannot have a key');
    }
    if (ref !== null) {
      throw new Error('Fragment cannot have a ref');
    }
    if (Object.keys(rest).length > 0) {
      throw new Error('Fragment cannot have props');
    }
    return normalizedChildren;
  }
  // If the type is specifically Text, verify that it's well-formed
  if (type === Text) {
    if (key !== null) {
      throw new Error('Text cannot have a key');
    }
    if (ref !== null) {
      throw new Error('Text cannot have a ref');
    }
    if (normalizedChildren.length > 0) {
      throw new Error('Text cannot have children');
    }
    // Must have exactly one prop - `text`
    if (Object.keys(rest).length !== 1 || !('text' in rest)) {
      throw new Error('Text must have a single prop - `text`');
    }
    return [{
      type: Text,
      props: {text: rest.text},
      key: null,
      ref: null,
      children: [],
    }];
  }
  // Return the MiniElement
  return [{
    type,
    props: rest,
    key: key || null,
    ref: ref || null,
    children: normalizedChildren,
  }];
}