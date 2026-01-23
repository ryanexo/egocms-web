import type { AxiosInstance } from 'axios'

import type { HttpClientPolicy } from '@/core/http-client/types/http-client'

import { messageService } from '@/core/services/message.service.ts'
import { useAuthStore } from '@/stores'

export function useCredentialInterceptor(axios: AxiosInstance) {
  axios.interceptors.request.use((config) => {
    if (!config.headers.has('Authorization')) {
      const authStore = useAuthStore()
      config.headers.set('Authorization', authStore.token)
    }

    return config
  })
}

export function useCustomConfigInterceptor(
  axios: AxiosInstance,
  policy: HttpClientPolicy,
) {
  axios.interceptors.response.use((response) => {
    if (response.config?.successMessage) {
      const message =
        response.config?.successMessage === true
          ? policy.defaultSuccessMessage()
          : response.config?.successMessage

      messageService.success(message)
    }

    return response
  })
}
