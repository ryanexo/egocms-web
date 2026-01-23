import type {
  AxiosRequestConfig,
  AxiosResponseTransformer,
  InternalAxiosRequestConfig,
} from 'axios'

import type { HttpClientPolicy } from '@/core/http-client/types/http-client'

import { HttpRequestException } from '@/core/exceptions/http-request.exception.ts'

export function useStandardResponseTransformer(
  policy: HttpClientPolicy,
): AxiosResponseTransformer {
  return function (this: InternalAxiosRequestConfig, data) {
    if (policy.isValidJsonData(data)) {
      if (!policy.isValidCode(data.code)) {
        throw new HttpRequestException<AxiosRequestConfig>(
          data.msg,
        ).withContext(this)
      }
      if (this.unwrapResponse !== false) {
        return data.data
      }
    }
    return data
  }
}
