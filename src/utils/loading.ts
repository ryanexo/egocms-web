import { reactive, ref } from 'vue'

import { createPromiseWithResolver } from '@/utils/promise.ts'

type PromiseResolve<T> = (value: T) => void

interface LoadingController<T> {
  done: PromiseResolve<T>
  result: Promise<T>
  start(): void
}

export interface Loading {
  createController<T = void>(): LoadingController<T>
  isLoading: boolean
  load<T = void>(executor: Callable): Promise<T>
}

function useLoading(duration: number = 200): Loading {
  const isLoading = ref(false)
  const context = { beginTime: 0, taskCount: 0 }

  const createResolver = <T>(originalResolve: PromiseResolve<T>): PromiseResolve<T> => {
    const resolve = (value: T) => {
      context.taskCount -= 1
      if (context.taskCount === 0) {
        context.beginTime = 0
        isLoading.value = false
      }
      originalResolve(value)
    }

    return (value) => {
      const currentTime = Date.now()
      const timeDiff = currentTime - context.beginTime

      if (duration === 0 || timeDiff >= duration) {
        resolve(value)
      } else {
        setTimeout(resolve, duration - timeDiff)
      }
    }
  }

  const startLoading = <T>() => {
    const { promise, reject, resolve } = createPromiseWithResolver<T>()

    if (context.beginTime === 0) {
      context.beginTime = Date.now()
    }
    context.taskCount += 1
    isLoading.value = true

    return { promise, reject: createResolver<T>(reject), resolve: createResolver<T>(resolve) }
  }

  const load = async <T>(executor: Callable) => {
    const { promise, reject: originalReject, resolve: originalResolve } = startLoading<T>()
    const resolve = createResolver<T>(originalResolve)
    const reject = createResolver<T>(originalReject)

    try {
      resolve(executor())
    } catch (error: any) {
      reject(error)
    }

    return promise
  }

  const createController = <T>(): LoadingController<T> => {
    let resolveMethod: PromiseResolve<T> = () => {}
    const promise = new Promise<T>((resolve) => {
      resolveMethod = createResolver(resolve)
    })

    return { done: resolveMethod, result: promise, start: startLoading }
  }

  return reactive({ createController, isLoading, load })
}

export { useLoading }
