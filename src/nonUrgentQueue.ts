import { isTransitioning } from "./transitions";

const maximumBlockTimeMS = 5;
const releaseTimeMS = 1000 / 60;

const nonUrgentQueue: (() => void)[] = [];
let nonUrgentTaskQueued = false;

function runNonUrgentTasks() {
  if (nonUrgentQueue.length === 0) {
    nonUrgentTaskQueued = false;
    return;
  }

  const start = performance.now();
  do {
    nonUrgentQueue.shift()();
  } while (nonUrgentQueue.length > 0 && performance.now() - start < maximumBlockTimeMS);

  if (nonUrgentQueue.length > 0) {
    setTimeout(runNonUrgentTasks, releaseTimeMS);
  } else {
    nonUrgentTaskQueued = false;
  }
}

export function runNonUrgent(fn: () => void): void {
  nonUrgentQueue.push(fn);
  if (!nonUrgentTaskQueued) {
    nonUrgentTaskQueued = true;
    queueMicrotask(runNonUrgentTasks);
  }
}

export function runAuto(fn: () => void): void {
  if (isTransitioning()) {
    runNonUrgent(fn);
  } else {
    queueMicrotask(fn);
  }
}
