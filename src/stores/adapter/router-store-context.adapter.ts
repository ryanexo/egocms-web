import type { Router } from 'vue-router'

import { trimStart } from 'es-toolkit'

import type { RouterContextProvider } from '@/stores/types/router.store'

export function useRouterStoreContextProvider(
  router: Router,
): RouterContextProvider {
  return {
    addRoute: (route) => router.addRoute(route),
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
      return () => import('@/pages/core/NotFound.vue')
    },
  }
}
