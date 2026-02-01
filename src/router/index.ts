import { cloneDeep } from 'es-toolkit'
import { createRouter, createWebHashHistory } from 'vue-router'

import { CoreRouteNameEnum } from '@/router/constants/route.enum.ts'
import {
  useAccessGuard,
  useDocumentTitleGuard,
  usePageRouteSync,
  useProgressGuard,
} from '@/router/guard/guard.ts'
import builtinRoutes from '@/router/routes/core.ts'

function createVueRouter() {
  /**
   * routes目录下所有文件均为自动注册的路由记录
   *
   * 所有非core.ts内注册的路由文件均被挂载在根节点下(path = '/')，统一布局
   */
  const customFiles = import.meta.glob('./routes/!(core).ts', { eager: true })
  const customRoutes = convertGlobResult(customFiles)

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
    cloneDeep(builtinRoutes).forEach((route) => router.addRoute(route))
    cloneDeep(customRoutes).forEach((route) => router.addRoute(CoreRouteNameEnum.Home, route))
  }

  useProgressGuard(router)
  useAccessGuard(router)
  useDocumentTitleGuard(router)
  usePageRouteSync(router)

  resetRoutes()

  return { resetRoutes, router }
}

function convertGlobResult(result: Record<string, unknown>) {
  return Object.values(result)
    .map((item) => (item as Record<string, any>).default)
    .flat()
}

export const { resetRoutes, router } = createVueRouter()
