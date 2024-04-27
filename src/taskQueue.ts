import { isTransitioning } from "./transitions";

const maximumBlockTimeMS = 5;
const releaseTimeMS = 1000 / 60;

const urgentQueue: (() => void)[] = [];
const nonUrgentQueue: (() => void)[] = [];
let isRunnerScheduled = false;

function nextTask(): { task: () => void; urgent: boolean } | null {
  if (urgentQueue.length > 0) {
    return { task: urgentQueue.shift()!, urgent: true };
  }
  if (nonUrgentQueue.length > 0) {
    return { task: nonUrgentQueue.shift()!, urgent: false };
  }
  return null;
}

// This auto-wrapping mechanism is for `flushSync`
type TaskWrapper = (task: () => void) => () => void;
let wrapTask: TaskWrapper | null = null;
let onQueueTask: (() => void) | null = null;

function runWithTaskWrapper<T>(wrapper: TaskWrapper, onQueue: () => void, fn: () => T): T {
  const oldWrapTask = wrapTask;
  const oldOnQueueTask = onQueueTask;
  wrapTask = wrapper;
  onQueueTask = onQueue;
  try {
    return fn();
  } finally {
    wrapTask = oldWrapTask;
    onQueueTask = oldOnQueueTask;
  }
}

function runTasksUntilCondition(predicate: () => boolean) {
  while (true) {
    const task = nextTask();
    if (task === null) {
      break;
    }
    task.task();
    if (predicate()) {
      break;
    }
  }
}

function runTasks() {
  const start = performance.now();
  runTasksUntilCondition(
    () => urgentQueue.length === 0 && performance.now() - start > maximumBlockTimeMS,
  );

  const shouldReschedule = urgentQueue.length > 0 || nonUrgentQueue.length > 0;
  if (shouldReschedule) {
    setTimeout(runTasks, releaseTimeMS);
  } else {
    isRunnerScheduled = false;
  }
}

export function flushSync<T>(fn: () => T): T {
  let numOutstandingSyncTasks = 0;
  function wrapper(task: () => void) {
    return () => {
      task();
      --numOutstandingSyncTasks;
    };
  }
  function onQueue() {
    numOutstandingSyncTasks++;
  }
  const result = runWithTaskWrapper(wrapper, onQueue, fn);
  // Run all tasks until there are no more sync tasks
  runTasksUntilCondition(() => numOutstandingSyncTasks === 0);
  return result;
}

export function enqueueTask(fn: () => void, urgent?: boolean) {
  if (urgent === undefined) {
    urgent = !isTransitioning();
  }
  const queue = urgent ? urgentQueue : nonUrgentQueue;
  if (wrapTask !== null) {
    fn = wrapTask(fn);
  }
  queue.push(fn);
  if (onQueueTask !== null) {
    onQueueTask();
  }
  if (!isRunnerScheduled) {
    isRunnerScheduled = true;
    queueMicrotask(runTasks);
  }
}
