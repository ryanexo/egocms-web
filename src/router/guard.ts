import type { Router } from 'vue-router'

import NProgress from 'nprogress'

import { useRouterStore } from '@/stores'

export function useDynamicRoutes(router: Router) {
  router.beforeEach((to, from, next) => {
    const routerStore = useRouterStore()
    routerStore.routes

    next()
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
