import type { Pinia } from 'pinia'

import { acceptHMRUpdate, defineStore } from 'pinia'

import type { UserInfo, UserStoreState } from '@/stores/types/user'

import { SessionExpiredException } from '@/core/errors/exceptions'

export function createUserStore(pinia: Pinia) {
  const store = defineStore('store.user', {
    actions: {
      /**
       * 用户未登录时会触发session expired
       */
      mustGetUser() {
        if (!this.userData) {
          throw new SessionExpiredException('未登录')
        }
        return this.userData as UserInfo
      },
      setUser(data: UserInfo) {
        this.userData = data
      },
      shouldGetUser() {
        return this.userData
      },
    },
    state: (): UserStoreState => {
      return {
        userData: undefined,
      }
    },
  })

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(store, import.meta.hot))
  }

  return () => store(pinia)
}
