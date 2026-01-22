import type { NavigationGuardReturn, Router } from 'vue-router'

import NProgress from 'nprogress'

import { messageService } from '@/services/message.service.ts'
import { useAppStore, useAuthStore, useRouterStore } from '@/stores'
import { useRouterStoreContextProvider } from '@/stores/adapter/router-store-context.adapter.ts'

export function useAccessGuard(router: Router) {
  router.beforeEach(async (to) => {
    const routerStore = useRouterStore()
    const authStore = useAuthStore()

    if (!to.meta.requiresAuth || routerStore.isRouteInWhitelist(to.path)) {
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
      const message = messageService.loading('正在加载菜单', { duration: 0 })
      const service = useRouterStoreContextProvider(router)
      await routerStore.generateRoutes(service)
      message.then((closer) => closer.close())
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
  NProgress.configure({ speed: 1000, trickle: true, trickleSpeed: 300 })

  router.beforeEach(() => {
    NProgress.start()
    return true
  })
  router.afterEach(() => NProgress.done())
}
