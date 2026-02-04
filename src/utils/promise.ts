export interface PromiseWithResolver<T> {
  promise: Promise<T>
  reject: (value: any) => void
  resolve: (value: T) => void
}

export function useResolver<T = void>(): PromiseWithResolver<T> {
  let resolve: PromiseWithResolver<T>['resolve'] = () => {}
  let reject: PromiseWithResolver<T>['reject'] = () => {}

  const promise = new Promise<T>((originalResolve, originalReject) => {
    resolve = originalResolve
    reject = originalReject
  })

  return { promise, reject, resolve }
}
