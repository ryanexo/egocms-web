import type { IErrorHandler } from '@/core/errors/types/handler'

import {
  AppException,
  HttpRequestException,
  SessionExpiredException,
} from '@/core/errors/exceptions'
import { SilentException } from '@/core/errors/exceptions/SilentException.ts'
import { router } from '@/router'
import { messageService, useAuthService } from '@/services'

const handle: IErrorHandler['handle'] = (error, context) => {
  if (error instanceof SilentException) {
    /* empty */
  } else if (error instanceof HttpRequestException) {
    messageService.error(error.message)
  } else if (error instanceof SessionExpiredException) {
    useAuthService(router).invalidateSession({
      redirect: router.currentRoute.value.fullPath,
    })
  } else if (error instanceof AppException) {
    messageService.error(error.message)
  }

  console.debug(error, context)
  throw error
}

export const errorHandler: IErrorHandler = { handle }
