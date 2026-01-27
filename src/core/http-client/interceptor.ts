import type { AxiosInstance } from 'axios'

import type { HttpClientPolicy } from '@/core/http-client/types/http-client'

export function useCredentialInterceptor(axios: AxiosInstance, policy: HttpClientPolicy) {
  axios.interceptors.request.use((config) => {
    if (config.withAuthorization && !config.headers.has('Authorization')) {
      config.headers.set('Authorization', policy.authorizationValue())
    }

    return config
  })
}

export function useCustomConfigInterceptor(axios: AxiosInstance, policy: HttpClientPolicy) {
  axios.interceptors.response.use((response) => {
    policy.sendSuccessMessage(response.config?.successMessage)
    return response
  })
}
