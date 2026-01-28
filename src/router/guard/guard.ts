import type { NavigationGuardReturn, Router } from 'vue-router'

import NProgress from 'nprogress'

import { CoreRouteNameEnum } from '@/router/constants/route.enum.ts'
import { useAppStore, useAuthStore, useRouterStore } from '@/stores'
import { useRouterStoreContextProvider } from '@/stores/adapters/router-context-provider.ts'

export function useAccessGuard(router: Router) {
  router.beforeEach(async (to) => {
    const routerStore = useRouterStore()
    const authStore = useAuthStore()

    if (to.name === CoreRouteNameEnum.Home && routerStore.homePath !== '') {
      return { path: routerStore.homePath, replace: true }
    }

    if (!to.meta.requiresAuth || routerStore.isRouteInWhitelist(to.path)) {
      if (to.path === routerStore.unauthorizedRedirectPath && authStore.isValid()) {
        const redirectPath = to.query?.redirect
        return typeof redirectPath === 'string' && redirectPath !== ''
          ? decodeURIComponent(redirectPath)
          : { path: routerStore.homePath, replace: true }
      }

      return true
    }

    if (!authStore.isValid()) {
      return authStore.notifySessionExpired(() => {
        const target: NavigationGuardReturn = {
          path: routerStore.unauthorizedRedirectPath,
        }
        if (to.path !== routerStore.homePath) {
          target.query = { redirect: encodeURIComponent(to.fullPath) }
        }
        return target
      })
    }

    if (!routerStore.loaded) {
      const service = useRouterStoreContextProvider(router)
      await routerStore.generateRoutes(service)
    }

    return true
  })
}

export function useDocumentTitleGuard(router: Router) {
  router.afterEach((to) => {
    useAppStore().setPageTitle(to.meta.title)
  })
}

export function useProgressGuard(router: Router) {
  NProgress.configure({ speed: 500, trickle: true, trickleSpeed: 200 })

  router.beforeEach(() => {
    NProgress.start()
    return true
  })
  router.afterEach(() => NProgress.done())
}
