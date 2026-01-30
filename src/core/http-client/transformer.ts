import type {
  AxiosRequestConfig,
  AxiosResponseTransformer,
  InternalAxiosRequestConfig,
} from 'axios'

import type { HttpClientPolicies } from '@/core/http-client/types/http-client'

import { HttpRequestException } from '@/core/exceptions'

export function useStandardResponseTransformer(
  policies: HttpClientPolicies,
): AxiosResponseTransformer {
  return function (this: InternalAxiosRequestConfig, data) {
    if (policies.validator.isValidJsonData(data)) {
      if (!policies.validator.isValidCode(data.code)) {
        throw new HttpRequestException<AxiosRequestConfig>(data.msg).withContext(this)
      }
      if (this.unwrapResponse !== false) {
        return data.data
      }
    }
    return data
  }
}
