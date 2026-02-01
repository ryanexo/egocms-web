import type { AxiosInstance } from 'axios'

import type { HttpClientPolicies } from '@/core/http-client/types/http-client'

import { HttpRequestException } from '@/core/errors/exceptions'
import { HttpResponseException } from '@/core/errors/exceptions/HttpResponseException.ts'

export function useCredentialInterceptor(axios: AxiosInstance, policies: HttpClientPolicies) {
  axios.interceptors.request.use((config) => {
    if (config.withAuthorization && !config.headers.has('Authorization')) {
      config.headers.set('Authorization', policies.authorizer.token())
    }

    return config
  })
}

export function useCustomConfigInterceptor(axios: AxiosInstance, policies: HttpClientPolicies) {
  axios.interceptors.response.use((response) => {
    policies.notifier.sendSuccessMessage(response.config?.successMessage)
    return response
  })
}

export function useRejectionInterceptor(axios: AxiosInstance, _: HttpClientPolicies) {
  axios.interceptors.request.use(undefined, (rejection) => {
    if (rejection instanceof HttpRequestException) {
      throw rejection
    }
    throw new HttpRequestException(rejection.reason ?? rejection.message, rejection)
  })
  axios.interceptors.response.use(undefined, (rejection) => {
    if (rejection instanceof HttpResponseException) {
      throw rejection
    }
    throw new HttpResponseException(rejection.reason ?? rejection.message, rejection)
  })
}

export function useStandardResponseInterceptor(axios: AxiosInstance, policies: HttpClientPolicies) {
  axios.interceptors.response.use((response) => {
    const data = response.data

    Promise.reject('test')

    if (policies.validator.isValidJsonData(data)) {
      if (!policies.validator.isValidCode(data.code)) {
        throw new HttpResponseException(data.msg).withContext(response)
      }
      if (response.config.unwrapResponse !== false) {
        response.data = data.data
      }
    }

    return response
  })
}
