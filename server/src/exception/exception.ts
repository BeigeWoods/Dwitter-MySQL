export default class ExceptionHandler<D, T> {
  private module: D;
  constructor(module: D) {
    this.module = module;
  }
  protected create = (e: unknown) => {
    const change = new Error(String(e));
    if (typeof e !== "string") change.name += `(${typeof e})`;
    return change;
  };

  setup = (e: Error | unknown, method: T, eToAddStack?: Error) => {
    if (!(e instanceof Error)) e = this.create(e);

    // add stack trace
    if (eToAddStack) (e as Error).stack! += eToAddStack.stack;
    // edit name
    (e as Error).name += ` > ${this.module}.${method}`;
    return e;
  };

  throw = (e: Error | unknown, method: T) => {
    throw this.setup(e, method);
  };
}
