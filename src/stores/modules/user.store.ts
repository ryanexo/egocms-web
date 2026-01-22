import type { Pinia } from 'pinia'

import { defineStore } from 'pinia'

import type { UserInfo, UserStoreState } from '@/stores/types/user.store'

export function createUserStore(pinia: Pinia) {
  const store = defineStore('UserStore', {
    actions: {
      getUser(): undefined | UserInfo {
        return this.userData
      },
      setUser(data: UserInfo) {
        this.userData = data
      },
    },
    state: (): UserStoreState => {
      return {
        userData: undefined,
      }
    },
  })

  return () => store(pinia)
}
