import { HookDispatcher } from "../hookDispatcher";

export class StaticHookDispatcher implements HookDispatcher {
  private keyCounter: number = 0;

  public exportedContext: Map<symbol, any> = new Map();
  public importedContext: Map<symbol, any>;
  public isErrorBoundary: boolean = false;
  public error: Error | Promise<any> | null;

  constructor(importedContext: Map<symbol, any>, error: Error | Promise<any> | null = null) {
    this.importedContext = importedContext;
    this.error = error;
  }

  useShared<T>(init: (key: string) => T): T {
    return init((this.keyCounter++).toString());
  }
  $useUpdateHandle(): (isPriority: boolean, callback?: () => void) => void {
    // Straighforwardly - static updates are a contradiction in terms
    return () => {};
  }
  useLifecycleCallback(
    point: "insert" | "layout" | "effect",
    callback: null | (() => void | (() => void)),
  ): void {
    // Static hooks don't have a lifecycle
  }
  $useReadContext(context: symbol): any {
    return this.importedContext.get(context);
  }
  $useProvideContext(context: symbol, value: any): void {
    this.exportedContext.set(context, value);
  }
  $useErrorBoundary(): Error | Promise<any> | null {
    return this.error;
  }
}
