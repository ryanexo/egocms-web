import type { Router } from 'vue-router'

import { trimStart } from 'es-toolkit'

import type { RouterContextProvider } from '@/stores/types/router'

import { CoreRouteNameEnum } from '@/router/constants/route.enum.ts'
import { messageService } from '@/services'

export function useRouterStoreContextProvider(router: Router): RouterContextProvider {
  const addRoute: RouterContextProvider['addRoute'] = (route) => {
    router.addRoute(CoreRouteNameEnum.Home, route)
  }
  const fetchComponents: RouterContextProvider['fetchComponents'] = () => {
    const files = import.meta.glob(`../../pages/**/*.{vue,tsx,ts}`)
    const result: GlobResults = {}

    Object.entries(files).forEach(([path, component]) => {
      const uri = trimStart(path.replace('../../pages', ''), '/')
      result[uri] = component as ImportFn
    })

    return result
  }
  const fetchRoutes: RouterContextProvider['fetchRoutes'] = () => {
    const message = messageService.loading('common.app.router.loadingMenus', { duration: 0 })
    const result = Promise.resolve([])
    message.then((closer) => closer.close())

    return result
  }
  const resolveNotExistsComponent: RouterContextProvider['resolveNotExistsComponent'] = () => {
    return () => import('@/pages/core/fallback/NotFound.vue')
  }

  return {
    addRoute,
    fetchComponents,
    fetchRoutes,
    resolveNotExistsComponent,
  }
}
