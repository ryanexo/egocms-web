export type Resolvable = Error | number | object | PromiseRejectionEvent | string

export interface IErrorCapturer {
  capture(error: Resolvable, context: CaptureContext): boolean
  isResolvable(error: any): error is Resolvable
}

export type ErrorSource = 'runtime' | 'vue'

export interface CaptureSource {
  source: ErrorSource
  timestamp: number
  traceId?: string
}

export type RuntimeErrorContext = CaptureSource & {
  promise: boolean
  source: 'runtime'
}

export type VueErrorContext = CaptureSource & {
  component?: string
  file?: string
  name?: string
  source: 'vue'
  timing: string
}

export type CaptureContext = RuntimeErrorContext | VueErrorContext
