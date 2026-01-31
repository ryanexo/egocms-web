import { createErrorCapturer } from '@/core/errors/capturer.ts'
import { createErrorHandler } from '@/core/errors/handler.ts'

export const errorHandler = createErrorHandler()
export const errorCapturer = createErrorCapturer(errorHandler)
