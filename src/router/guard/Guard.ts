import type { NavigationGuardReturn, Router } from 'vue-router'

import NProgress from 'nprogress'

import { useRouterService } from '@/router/service.ts'
import { useAuthStore, useRouterStore } from '@/stores'

export function useAccessGuard(router: Router) {
  router.beforeEach(async (to) => {
    debugger
    const routerStore = useRouterStore()
    const authStore = useAuthStore()

    if (routerStore.isRouteInWhitelist(to.path)) {
      if (
        to.path === routerStore.unauthorizedRedirectPath &&
        authStore.isValid()
      ) {
        const redirectPath = to.query?.redirect
        return typeof redirectPath === 'string' && redirectPath !== ''
          ? decodeURIComponent(redirectPath)
          : { path: routerStore.homePath }
      }

      return true
    }

    if (!authStore.isValid()) {
      const target: NavigationGuardReturn = {
        path: routerStore.unauthorizedRedirectPath,
      }
      if (to.path !== routerStore.homePath) {
        target.query = { redirect: encodeURIComponent(to.fullPath) }
      }
      return target
    }

    if (!routerStore.loaded) {
      const service = useRouterService(router)
      await routerStore.generateRoutes(service)
    }

    return true
  })
}

export function useProgressGuard(router: Router) {
  NProgress.configure({ speed: 1000, trickle: true, trickleSpeed: 300 })

  router.beforeEach(() => {
    NProgress.start()
    return true
  })
  router.afterEach(() => NProgress.done())
}
