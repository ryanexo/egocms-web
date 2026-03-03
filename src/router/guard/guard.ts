import type { RouteLocationNormalizedGeneric, Router } from 'vue-router'

import { CoreRouteNameEnum } from '@/router/constants/route.enum.ts'
import { progressService, useAuthService } from '@/services'
import { useAppStore, useAuthStore, useRouteStore } from '@/stores'
import { useRouteStoreContextProvider } from '@/stores/providers/router-context.ts'

export function useAccessGuard(router: Router) {
  const extractRedirectURI = (to: RouteLocationNormalizedGeneric) => {
    const redirectValue = to.query?.redirect
    return typeof redirectValue === 'string' && redirectValue !== ''
      ? router.resolve(decodeURIComponent(redirectValue))
      : undefined
  }

  router.beforeEach(async (to) => {
    const routeStore = useRouteStore()
    const authStore = useAuthStore()

    if (to.name === CoreRouteNameEnum.Home && routeStore.homePath !== undefined) {
      return { path: routeStore.homePath, replace: true }
    }

    if (to.meta.requiresAuth === false || routeStore.isRouteInWhitelist(to.path)) {
      if (to.path === routeStore.unauthorizedRedirectPath && authStore.isValid()) {
        const redirect = extractRedirectURI(to)
        return redirect
          ? { ...redirect, replace: true }
          : { path: routeStore.homePath, replace: true }
      }

      return true
    }

    if (!authStore.isValid()) {
      useAuthService().invalidateSession({ redirect: to.fullPath })
      return false
    }

    if (!routeStore.loaded) {
      const service = useRouteStoreContextProvider(router)
      await routeStore.generateRoutes(service)

      const redirect = extractRedirectURI(to) ?? router.resolve(to.fullPath)
      return { ...redirect, replace: true }
    }

    return true
  })
}

export function useDocumentTitleGuard(router: Router) {
  router.afterEach((to) => {
    useAppStore().setPageTitle(to.meta?.title ?? '')
  })
}

export function useProgressGuard(router: Router) {
  router.beforeEach(() => {
    progressService.start()
    return true
  })
  router.afterEach(() => progressService.done())
}
