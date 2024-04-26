import type { MiniNode, MiniElement } from './component';
import { Text } from './component';

export function nodesToElements(nodes: MiniNode[]): MiniElement[] {
  const elements: MiniElement[] = [];
  const worklist: MiniNode[] = [...nodes];
  worklist.reverse();
  while (worklist.length > 0) {
    const node = worklist.pop();
    if (node === undefined || node === null) {
      continue;
    }
    if (typeof node === 'string' || typeof node === 'number') {
      elements.push({
        type: Text,
        props: {text: node.toString()},
        key: null,
        ref: null,
        children: [],
      });
    } else if (Array.isArray(node)) {
      worklist.push(...node.toReversed());
    } else {
      // It must be a MiniElement at this point... right?
      if (typeof node === 'function') {
        throw new Error('Invalid node - did you pass a component instead of an element (e.g. Component instead of <Component />)?');
      }
      if (!node.type || !node.props) {
        throw new Error('Invalid MiniElement');
      }
      elements.push(node);
    }
  }
  return elements;
}