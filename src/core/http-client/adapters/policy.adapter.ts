import type {
  HttpClientAuthorizer,
  HttpClientNotifier,
  HttpClientPolicies,
  HttpClientValidator,
} from '@/core/http-client/types/http-client'

import { messageService } from '@/core/services/MessageService.ts'
import { trans } from '@/locales'
import { useAuthStore } from '@/stores'

export function createHttpClientValidator(): HttpClientValidator {
  const isValidCode: HttpClientValidator['isValidCode'] = (code) => {
    return code === 'SERVER-000-00000'
  }
  const isValidJsonData: HttpClientValidator['isValidJsonData'] = (
    response: any,
  ): response is HttpResponse => {
    if (response === null || typeof response !== 'object') {
      return false
    }

    return Reflect.has(response, 'code') && Reflect.has(response, 'msg')
  }

  return { isValidCode, isValidJsonData }
}

export function createHttpClientAuthorizer(): HttpClientAuthorizer {
  const reauthorize: HttpClientAuthorizer['reauthorize'] = () => Promise.resolve(false)
  const token: HttpClientAuthorizer['token'] = () => useAuthStore().token
  return { reauthorize, token }
}

export function createHttpClientNotifier(): HttpClientNotifier {
  const sendSuccessMessage: HttpClientNotifier['sendSuccessMessage'] = (message) => {
    if (message === undefined) {
      return
    }
    const messageStr = message === true ? trans('common.http.success') : message
    messageService.success(messageStr)
  }

  return { sendSuccessMessage }
}

export function useHttpClientDefaultConfig(): HttpClientPolicies {
  return {
    authorizer: createHttpClientAuthorizer(),
    notifier: createHttpClientNotifier(),
    validator: createHttpClientValidator(),
  }
}
