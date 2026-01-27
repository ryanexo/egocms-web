import type { HttpClientPolicy } from '@/core/http-client/types/http-client'

import { messageService } from '@/core/services/MessageService.ts'
import { useAuthStore } from '@/stores'

export function useHttpClientPolicy(): HttpClientPolicy {
  const isValidCode: HttpClientPolicy['isValidCode'] = (code) => {
    return code === 'SERVER-000-00000'
  }

  const isValidJsonData: HttpClientPolicy['isValidJsonData'] = (
    response: any,
  ): response is HttpResponse => {
    if (response === null || typeof response !== 'object') {
      return false
    }

    return Reflect.has(response, 'code') && Reflect.has(response, 'msg')
  }

  const sendSuccessMessage: HttpClientPolicy['sendSuccessMessage'] = (message) => {
    if (message === undefined) {
      return
    }
    const messageStr = message === true ? '操作成功' : message
    messageService.success(messageStr)
  }

  const authorizationValue: HttpClientPolicy['authorizationValue'] = () => useAuthStore().token

  return { authorizationValue, isValidCode, isValidJsonData, sendSuccessMessage }
}
