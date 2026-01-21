import type { Router } from 'vue-router'

import { trimStart } from 'es-toolkit'

import type { RouterStoreService } from '@/stores/types/RouterStore'

export function useRouterService(router: Router): RouterStoreService {
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
      return () => import('@/pages/Core/NotFound.vue')
    },
  }
}
