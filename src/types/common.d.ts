declare interface Callable {
  (...args: any): any
}

declare type ImportFn<T = any> = () => Promise<{ default?: T }>

declare type GlobResults<T = any> = Record<string, ImportFn<T>>
