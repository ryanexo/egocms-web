import type { App } from 'vue'

import { createErrorCapturer } from '@/core/errors/capturer.ts'
import { errorHandler } from '@/core/errors/handler.ts'

export const errorCapturer = createErrorCapturer(errorHandler)

export function setupListeners(app: App) {
  const errorFlag = Symbol('handled error')

  app.config.errorHandler = (err, instance, info) => {
    if (err instanceof Error) {
      errorCapturer.capture(err, {
        file: instance?.$options?.__file,
        name: instance?.$options?.__name,
        source: 'vue',
        timestamp: Date.now(),
        timing: info,
      })
    }
  }

  window.addEventListener('error', (e) => {
    if (e.error[errorFlag]) {
      return
    }

    e.error[errorFlag] = true
    errorCapturer.capture(e.error, {
      promise: false,
      source: 'runtime',
      timestamp: Date.now(),
    })
    e.preventDefault()
  })

  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason[errorFlag]) {
      return
    }

    e.reason[errorFlag] = true
    errorCapturer.capture(e.reason, {
      promise: true,
      source: 'runtime',
      timestamp: Date.now(),
    })
    e.preventDefault()
  })
}
