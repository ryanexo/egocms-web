import { createRouter, createWebHashHistory } from 'vue-router'

import { useDynamicRoutes, useProgressGuard } from '@/router/guard.ts'

function createVueRouter() {
  const builtinRoutes = import.meta.glob('./builtin/*.ts', { eager: true })
  const routes = Object.values(builtinRoutes)
    .map((item) => (item as Record<string, any>).default)
    .flat()

  const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: (to, _, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      }
      return to.hash ? { behavior: 'smooth', el: to.hash } : { left: 0, top: 0 }
    },
  })

  useProgressGuard(router)
  useDynamicRoutes(router)

  return router
}

export const router = createVueRouter()
