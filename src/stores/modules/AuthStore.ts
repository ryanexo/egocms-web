import type { Pinia } from 'pinia'

import dayjs from 'dayjs'
import { defineStore } from 'pinia'

import type { AuthStoreState } from '@/stores/types/AuthStore'

export function createAuthStore(pinia: Pinia) {
  const store = defineStore('AuthStore', {
    actions: {
      isExpired() {
        if (this.expires === 0) {
          return false
        }
        return dayjs(this.expires).isBefore(dayjs())
      },
      isValid() {
        return this.token !== '' && !this.isExpired()
      },
      setToken(token: string, expires: AuthStoreState['expires'] = 0) {
        this.token = token
        this.expires = expires
      },
    },
    state: (): AuthStoreState => {
      return {
        authModalVisible: false,
        expires: 0,
        token: '',
      }
    },
  })

  return () => store(pinia)
}
