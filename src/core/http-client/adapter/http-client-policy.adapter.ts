import type { HttpClientPolicy } from '@/core/http-client/types/http-client'

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

  const defaultSuccessMessage: HttpClientPolicy['defaultSuccessMessage'] = () => {
    return '操作成功'
  }

  return { defaultSuccessMessage, isValidCode, isValidJsonData }
}
