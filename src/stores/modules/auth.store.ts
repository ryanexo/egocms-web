import type { Pinia } from 'pinia'

import dayjs from 'dayjs'
import { castArray } from 'es-toolkit/compat'
import { defineStore } from 'pinia'

import type { AuthStoreState, Permission } from '@/stores/types/auth'

export function createAuthStore(pinia: Pinia) {
  const store = defineStore('store.auth', {
    actions: {
      /**
       * 检查当前用户是否含有指定权限，通用权限请使用scope = '/'
       */
      isAuthorized(scope: string, perm: string | string[], requireAll: boolean = true) {
        const perms = castArray(perm)
        const matchFn = (perm: string) => this.permission.has(formatPerm(scope, perm))
        return requireAll ? perms.every(matchFn) : perms.some(matchFn)
      },
      /**
       * 检查当前授权是否过期，如授权不支持有效期则永远为false
       */
      isExpired() {
        if (this.expires === 0) {
          return false
        }
        return dayjs(this.expires).isBefore(dayjs())
      },
      /**
       * 检查当前用户授权是否有效
       */
      isValid() {
        return this.token !== '' && !this.isExpired()
      },
      /**
       * 设置当前用户权限
       * @param perms 权限列表，Key为Scope（通常是路由Path），Value为权限值
       * @param replace 替换现有权限，false时追加
       */
      setPermission(perms: Permission[], replace: boolean = true) {
        const result: string[] = []
        perms.forEach((item) => {
          item.perm.forEach((perm) => result.push(formatPerm(item.scope, perm)))
        })

        if (replace) {
          this.permission = new Set(result)
        } else {
          result.forEach((item) => this.permission.add(item))
        }
      },
      setToken(token: string, expires: AuthStoreState['expires'] = 0) {
        this.token = token
        this.expires = expires
      },
    },
    persist: { pick: ['expires', 'token'] },
    state: (): AuthStoreState => {
      return {
        expires: 0,
        permission: new Set(),
        token: '',
      }
    },
  })

  return () => store(pinia)
}

function formatPerm(scope: string, perm: string) {
  return [scope, perm].join(':')
}
