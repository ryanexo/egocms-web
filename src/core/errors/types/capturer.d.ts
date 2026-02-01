export interface IErrorCapturer {
  capture(error: Error | PromiseRejectionEvent, context: CaptureContext): void
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
