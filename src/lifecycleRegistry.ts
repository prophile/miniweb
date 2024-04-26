export class LifecycleRegistry {
  private _index = 0;
  private _needsExecution = false;
  private _lifecycles: (() => (() => void) | void)[] = [];
  private _cleanups: (null | (() => void))[] = [];
  private _executeFlags: boolean[] = [];

  prepare() {
    this._index = 0;
    this._needsExecution = false;
  }

  runAllCleanups() {
    for (const cleanup of this._cleanups) {
      cleanup();
    }
  }

  mustExecute() {
    return this._needsExecution;
  }

  useLifecycle(lifecycle: null | (() => (() => void) | void)) {
    const index = this._index++;
    if (!lifecycle) {
      return;
    }
    this._lifecycles[index] = lifecycle;
    this._executeFlags[index] = true;
    this._needsExecution = true;
  }

  execute() {
    for (let i = 0; i < this._index; i++) {
      if (this._executeFlags[i]) {
        const cleanup = this._cleanups[i];
        if (cleanup) {
          cleanup();
        }
      }
    }
    for (let i = 0; i < this._index; i++) {
      this._cleanups[i] = this._lifecycles[i]() || null;
      this._executeFlags[i] = false;
    }
    this._needsExecution = false;
  }
}
