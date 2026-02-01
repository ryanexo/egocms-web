import type { StackFrame } from 'stacktrace-parser'

import type {
  CaptureSource,
  RuntimeErrorContext,
  VueErrorContext,
} from '@/core/errors/types/capturer'

export interface CapturedContext extends CaptureSource {
  actions: Array<{ name: string; trigger?: string }>
  frames: Promise<StackFrame[]>
  screen: { height: number; width: number }
  userAgent: string
}

export type CapturedVueContext = CapturedContext & VueErrorContext
export type CapturedRuntimeContext = CapturedContext & RuntimeErrorContext
export type HandlerContext = CapturedRuntimeContext | CapturedVueContext

export interface IErrorHandler {
  handle(error: Error, source: HandlerContext): boolean
}
