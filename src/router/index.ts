import { createRouter, createWebHashHistory } from 'vue-router'

import { useAccessGuard, useProgressGuard } from '@/router/guard/Guard.ts'

function createVueRouter() {
  const builtinRoutes = import.meta.glob('./builtin/*.ts', { eager: true })
  const routes = Object.values(builtinRoutes)
    .map((item) => (item as Record<string, any>).default)
    .flat()

  const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [],
    scrollBehavior: (to, _, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      }
      return to.hash ? { behavior: 'smooth', el: to.hash } : { left: 0, top: 0 }
    },
  })
  const resetRoutes = () => {
    router.clearRoutes()
    routes.forEach((route) => router.addRoute(route))
  }

  useProgressGuard(router)
  useAccessGuard(router)
  resetRoutes()

  return { resetRoutes, router }
}

export const { resetRoutes, router } = createVueRouter()
