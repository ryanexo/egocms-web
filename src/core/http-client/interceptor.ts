import type { AxiosInstance } from 'axios'

import type { HttpClientPolicies } from '@/core/http-client/types/http-client'

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
