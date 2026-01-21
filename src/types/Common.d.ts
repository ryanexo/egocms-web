declare interface Callable {
  (...args: any): any
}

declare type GlobFile = () => Promise<{ default?: any }>

declare type GlobResults = Record<string, GlobFile>

declare type MaybePromise<T> = Promise<T> | T
