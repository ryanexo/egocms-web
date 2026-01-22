import type { AxiosInstance } from 'axios'

import { messageService } from '@/services/message.service.ts'
import { useAppStore, useAuthStore } from '@/stores'

export function useCredentialInterceptor(axios: AxiosInstance) {
  axios.interceptors.request.use((config) => {
    if (!config.headers.has('Authorization')) {
      const authStore = useAuthStore()
      config.headers.set('Authorization', authStore.token)
    }

    return config
  })
}

export function useCustomConfigInterceptor(axios: AxiosInstance) {
  axios.interceptors.response.use((response) => {
    if (response.config?.successMessage) {
      const message =
        response.config?.successMessage === true
          ? useAppStore().operationSuccessMessage
          : response.config?.successMessage

      messageService.success(message)
    }

    return response
  })
}
