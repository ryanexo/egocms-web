import type { IErrorHandler } from '@/core/errors/types/handler'

import { HttpRequestException, SessionExpiredException } from '@/core/errors/exceptions'
import { SilentException } from '@/core/errors/exceptions/SilentException.ts'
import { messageService } from '@/core/services/messageService.ts'
import { useAuthStore } from '@/stores'

export function createErrorHandler(): IErrorHandler {
  const handle: IErrorHandler['handle'] = (error, _context) => {
    if (error instanceof SilentException) {
      /* empty */
    } else if (error instanceof HttpRequestException) {
      messageService.error(error.message)
    } else if (error instanceof SessionExpiredException) {
      useAuthStore().sessionExpired((redirector) => redirector.requireAuthentication())
    }
  }

  return { handle }
}
