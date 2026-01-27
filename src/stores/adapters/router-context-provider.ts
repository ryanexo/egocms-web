import type { Router } from 'vue-router'

import { trimStart } from 'es-toolkit'

import type { RouterContextProvider } from '@/stores/types/router'

import { CoreRouteNameEnum } from '@/router/constants/route.enum.ts'

export function useRouterStoreContextProvider(router: Router): RouterContextProvider {
  return {
    addRoute: (route) => router.addRoute(CoreRouteNameEnum.Home, route),
    fetchComponents: () => {
      const files = import.meta.glob(`../../pages/**/*.{vue,tsx,ts}`)
      const result: GlobResults = {}

      Object.entries(files).forEach(([path, component]) => {
        const uri = trimStart(path.replace('../../pages', ''), '/')
        result[uri] = component as GlobFile
      })

      return result
    },
    fetchRoutes: () => Promise.resolve([]),
    resolveNotExistsComponent: (_: string) => {
      return () => import('@/pages/core/fallback/NotFound.vue')
    },
  }
}
