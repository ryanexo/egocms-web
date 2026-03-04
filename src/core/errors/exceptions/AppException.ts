export class AppException<T> extends Error {
  protected context: T | undefined
  protected prev: Error | undefined

  constructor(message: string, prev?: Error) {
    super(message)
    this.prev = prev
  }

  public getContext(): T | undefined {
    return this.context
  }

  public unwrap(): Error | undefined {
    return this.prev
  }

  public withContext(ctx: T) {
    this.context = ctx
    return this
  }
}
