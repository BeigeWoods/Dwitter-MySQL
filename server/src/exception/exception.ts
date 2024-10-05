export default class ExceptionHandler<D, T> {
  private module: D;
  constructor(module: D) {
    this.module = module;
  }

  protected editName = (e: Error, method: T) =>
    (e.name += ` > ${this.module}.${method}`);

  protected create = (e: unknown) => {
    const change = new Error(String(e));
    if (typeof e !== "string") change.name += `(${typeof e})`;
    return change;
  };

  setup = (e: Error | unknown, method: T) => {
    if (e === null || typeof e !== "object" || !("name" in e!))
      e = this.create(e);
    this.editName(e as Error, method);
    return e as Error;
  };

  throw = (e: Error | unknown, method: T) => {
    throw this.setup(e, method);
  };
}
