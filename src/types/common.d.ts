declare interface Callable {
  (...args: any): any
}

declare type GlobFile = () => Promise<{ default?: any }>

declare type GlobResults = Record<string, GlobFile>
