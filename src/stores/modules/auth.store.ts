import type { Arrayable } from '@vueuse/core'
import type { Pinia } from 'pinia'

import dayjs from 'dayjs'
import { castArray } from 'es-toolkit/compat'
import { defineStore } from 'pinia'

import type { AuthStoreState } from '@/stores/types/auth.store'

export function createAuthStore(pinia: Pinia) {
  const store = defineStore('AuthStore', {
    actions: {
      isAuthorized(path: string, perm: string) {
        return this.permission.has(formatPerm(path, perm))
      },
      isExpired() {
        if (this.expires === 0) {
          return false
        }
        return dayjs(this.expires).isBefore(dayjs())
      },
      isValid() {
        return this.token !== '' && !this.isExpired()
      },
      notifySessionExpired<T>(fallback: () => T) {
        if (this.unauthorizedHandler) {
          return this.unauthorizedHandler()
        }
        return fallback()
      },
      /**
       * 设置当前用户权限
       * @param perm 权限列表，Key为路由Path，Value为权限值
       * @param replace 替换现有权限，false时追加
       */
      setPermission(perm: Record<string, Arrayable<string>>, replace: boolean = true) {
        const result: string[] = []
        Object.entries(perm).forEach(([path, permList]) => {
          castArray(permList).forEach((item) => {
            result.push(formatPerm(path, item))
          })
        })

        if (replace) {
          this.permission = new Set(result)
        } else {
          result.forEach((item) => this.permission.add(item))
        }
      },
      setSessionExpiredHandler(handler: AuthStoreState['unauthorizedHandler']) {
        this.unauthorizedHandler = handler
      },
      setToken(token: string, expires: AuthStoreState['expires'] = 0) {
        this.token = token
        this.expires = expires
      },
    },
    state: (): AuthStoreState => {
      return {
        expires: 0,
        permission: new Set(),
        token: '',
        unauthorizedHandler: undefined,
      }
    },
  })

  return () => store(pinia)
}

function formatPerm(path: string, perm: string) {
  return [path, perm].join('/')
}
