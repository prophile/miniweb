export type DiffResult<Left, Right> =
  | {
      type: "match";
      left: Left;
      right: Right;
    }
  | {
      type: "delete";
      right: Right;
    }
  | {
      type: "insert";
      left: Left;
      beforeRight?: Right;
    };

export function diff<Left, Right>(
  left: Left[],
  right: Right[],
  match: (left: Left, right: Right) => boolean,
  leftKey: (left: Left) => string | number | null,
  rightKey: (right: Right) => string | number | null,
): DiffResult<Left, Right>[] {
  let leftIx = 0;
  let rightIx = 0;
  const leftCount = left.length;
  const rightCount = right.length;
  const diffs: DiffResult<Left, Right>[] = [];

  const leftKeys = left.map(leftKey);
  const rightKeys = right.map(rightKey);

  const allLeftKeys = new Set(leftKeys);
  const allRightKeys = new Set(rightKeys);

  function insert(left: Left, beforeIndex: number) {
    if (beforeIndex >= rightCount) {
      diffs.push({ type: "insert", left });
    } else {
      diffs.push({ type: "insert", left, beforeRight: right[beforeIndex] });
    }
  }

  while (leftIx < leftCount && rightIx < rightCount) {
    const leftKey = leftKeys[leftIx];
    const rightKey = rightKeys[rightIx];
    const leftItem = left[leftIx];
    const rightItem = right[rightIx];

    // If the keys match, it's a match in principle. We still need to actually match()
    // the two though in case the types have been changed. Note that this case also
    // handles the case where the elements aren't keyed.
    if (leftKey === rightKey) {
      if (match(leftItem, rightItem)) {
        diffs.push({ type: "match", left: leftItem, right: rightItem });
      } else {
        // Delete the right item and insert the left item
        diffs.push({ type: "delete", right: rightItem });
        insert(leftItem, rightIx + 1);
      }
      leftIx++;
      rightIx++;
      continue;
    }

    // If the left key _is_ in the right keys (but not at this index) then we delete
    // the right item and pretend we never saw it.
    if (leftKey !== null && allRightKeys.has(leftKey)) {
      diffs.push({ type: "delete", right: rightItem });
      allRightKeys.delete(leftKey);
      rightIx++;
      continue;
    }

    // The left key is therefore not in the right keys; insert it here.
    else {
      insert(leftItem, rightIx);
      leftIx++;
      continue;
    }
  }

  // Handle leftovers
  while (rightIx < rightCount) {
    diffs.push({ type: "delete", right: right[rightIx++] });
  }

  while (leftIx < leftCount) {
    diffs.push({ type: "insert", left: left[leftIx++] });
  }

  // Return the diff
  return diffs;
}
