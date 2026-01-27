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

  public is(checker: (e: Error) => boolean): boolean {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let err: any = this

    do {
      if (checker(err)) {
        return true
      }
      const prevError = err?.unwrap?.()
      if (prevError && prevError instanceof Error) {
        err = prevError
      }
    } while (err instanceof Error)

    return false
  }

  public unwrap(): Error | undefined {
    return this.prev
  }

  public withContext(ctx: T) {
    this.context = ctx
    return this
  }
}
