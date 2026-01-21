declare interface Callable {
  (...args: any): any
}

declare type MaybePromise<T> = Promise<T> | T
