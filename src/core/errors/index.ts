import type { App } from 'vue'
import type { Router } from 'vue-router'

import { isNil } from 'es-toolkit'

import { createErrorCapturer } from '@/core/errors/capturer.ts'
import { createErrorHandler } from '@/core/errors/handler.ts'

export function startErrorCapture(app: App, router: Router) {
  const errorHandler = createErrorHandler(router)
  const errorCapturer = createErrorCapturer(errorHandler)

  app.config.errorHandler = (err, instance, info) => {
    if (err instanceof Error) {
      const handled = errorCapturer.capture(err, {
        file: instance?.$options?.__file,
        name: instance?.$options?.__name,
        source: 'vue',
        timestamp: Date.now(),
        timing: info,
      })
      if (handled) {
        return
      }
    }
    throw err
  }

  window.addEventListener('error', (e) => {
    if (!isNil(e.error)) {
      const handled = errorCapturer.capture(e.error, {
        promise: false,
        source: 'runtime',
        timestamp: Date.now(),
      })
      if (handled) {
        e.preventDefault()
      }
    }
  })

  window.addEventListener('unhandledrejection', (e) => {
    if (!isNil(e.reason)) {
      const handled = errorCapturer.capture(e.reason, {
        promise: true,
        source: 'runtime',
        timestamp: Date.now(),
      })
      if (handled) {
        e.preventDefault()
      }
    }
  })
}
