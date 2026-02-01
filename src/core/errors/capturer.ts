import type { Arrayable } from '@vueuse/core'

import { castArray } from 'es-toolkit/compat'
import StackTrace from 'stacktrace-js'

import type { IErrorCapturer } from '@/core/errors/types/capturer.d.ts'
import type { CapturedContext, IErrorHandler } from '@/core/errors/types/handler'

import { SilentException } from '@/core/errors/exceptions/SilentException.ts'

function useActionQueue(eventName: Arrayable<keyof DocumentEventMap>, size: number = 10) {
  const events: Event[] = []
  const eventNames = castArray<keyof DocumentEventMap>(eventName)
  const listener = function (this: Document, e: Event) {
    if (events.length >= size) {
      events.shift()
    }
    events.push(e)
  }

  const destroy = () => {
    eventNames.forEach((name) => document.removeEventListener(name, listener, { capture: true }))
  }

  eventNames.forEach((name) => document.addEventListener(name, listener, { capture: true }))

  return { destroy, events }
}

function getElementSelector(element: HTMLElement) {
  const path: string[] = []
  let currentElement: Element | null = element

  while (currentElement && currentElement.nodeType === Node.ELEMENT_NODE) {
    let selector = currentElement.nodeName.toLowerCase()

    if (currentElement.id) {
      selector = `#${currentElement.id}`
    } else if (currentElement.className) {
      selector += '.' + currentElement.className.trim().split(/\s+/).join('.')
    }

    const siblings = currentElement.parentNode ? currentElement.parentNode.children : []
    const index = Array.prototype.indexOf.call(siblings, currentElement) + 1
    if (siblings.length > 1) {
      selector += `:nth-of-type(${index})`
    }

    path.unshift(selector)
    currentElement = currentElement.parentNode as Element | null
  }

  return path.join(' > ')
}

export function createErrorCapturer(handler: IErrorHandler): IErrorCapturer {
  const { events } = useActionQueue([
    'click',
    'keydown',
    'blur',
    'focus',
    'dblclick',
    'scroll',
    'contextmenu',
  ])

  const normalizeError = (e: unknown) => {
    if (e instanceof Error) {
      return e
    }
    return new SilentException(e)
  }
  const capture: IErrorCapturer['capture'] = (error, context) => {
    if (error instanceof PromiseRejectionEvent) {
      return capture(normalizeError(error.reason), {
        promise: true,
        source: 'runtime',
        timestamp: context.timestamp,
      })
    }

    error = normalizeError(error)

    const userAgent: CapturedContext['userAgent'] = navigator.userAgent
    const screen: CapturedContext['screen'] = {
      height: window.screen.height,
      width: window.screen.width,
    }
    const actions: CapturedContext['actions'] = events.slice().map((item) => {
      return {
        name: item.type,
        trigger: item.target instanceof HTMLElement ? getElementSelector(item.target) : undefined,
      }
    })
    const frames = StackTrace.fromError(error, { offline: true })

    return handler.handle(error, {
      ...context,
      actions,
      frames,
      screen,
      userAgent,
    })
  }

  return { capture }
}
