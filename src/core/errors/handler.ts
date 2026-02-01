import type { Router } from 'vue-router'

import type { IErrorHandler } from '@/core/errors/types/handler'

import {
  AppException,
  HttpRequestException,
  SessionExpiredException,
} from '@/core/errors/exceptions'
import { HttpResponseException } from '@/core/errors/exceptions/HttpResponseException.ts'
import { SilentException } from '@/core/errors/exceptions/SilentException.ts'
import { messageService, useAuthServiceWithRouter } from '@/services'

export function createErrorHandler(router: Router) {
  const handle: IErrorHandler['handle'] = (error, context) => {
    if (error instanceof SilentException) {
      /* empty */
      return true
    } else if (error instanceof HttpRequestException) {
      messageService.error(error.message)
      return true
    } else if (error instanceof HttpResponseException) {
      const code = error.getContext()?.data?.code
      const message = code ? `${error.message} [${code}]` : error.message
      messageService.error(message)
      return true
    } else if (error instanceof SessionExpiredException) {
      useAuthServiceWithRouter(router).invalidateSession({
        redirect: router.currentRoute.value.fullPath,
      })
      return true
    } else if (error instanceof AppException) {
      messageService.error(error.message)
      return true
    }

    console.debug(context)
    return false
  }

  return { handle }
}
