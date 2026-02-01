import type { RouteLocationNormalizedGeneric, Router } from 'vue-router'

import { CoreRouteNameEnum } from '@/router/constants/route.enum.ts'
import { progressService, useAuthService } from '@/services'
import { useAppStore, useAuthStore, useRouterStore } from '@/stores'
import { useRouterStoreContextProvider } from '@/stores/adapters/router-context-provider.ts'

export function useAccessGuard(router: Router) {
  const extractRedirectURI = (to: RouteLocationNormalizedGeneric) => {
    const redirectValue = to.query?.redirect
    return typeof redirectValue === 'string' && redirectValue !== ''
      ? router.resolve(decodeURIComponent(redirectValue))
      : undefined
  }

  router.beforeEach(async (to) => {
    const routerStore = useRouterStore()
    const authStore = useAuthStore()

    if (to.name === CoreRouteNameEnum.Home && routerStore.homePath !== '') {
      return { path: routerStore.homePath, replace: true }
    }

    if (!to.meta.requiresAuth || routerStore.isRouteInWhitelist(to.path)) {
      if (to.path === routerStore.unauthorizedRedirectPath && authStore.isValid()) {
        const redirect = extractRedirectURI(to)
        return redirect
          ? { ...redirect, replace: true }
          : { path: routerStore.homePath, replace: true }
      }

      return true
    }

    if (!authStore.isValid()) {
      useAuthService().invalidateSession({ redirect: to.fullPath })
      return false
    }

    if (!routerStore.loaded) {
      const service = useRouterStoreContextProvider(router)
      await routerStore.generateRoutes(service)

      const redirect = extractRedirectURI(to)
      if (redirect) {
        return { ...redirect, replace: true }
      }
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
  router.beforeEach(() => {
    progressService.start()
    return true
  })
  router.afterEach(() => progressService.done())
}
