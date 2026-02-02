import type { RouteRecordRaw } from 'vue-router'

import { cloneDeep } from 'es-toolkit'
import { watch } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import { useAccessGuard, useDocumentTitleGuard, useProgressGuard } from '@/router/guard/guard.ts'
import builtinRoutes from '@/router/routes/core.ts'
import { usePageService } from '@/services'

function createVueRouter() {
  /**
   * routes目录下所有文件均为自动注册的路由记录
   *
   * 所有非core.ts内注册的路由文件均被挂载在根节点下(path = '/')，统一布局
   *
   * 没有name的路由无法显示在菜单中
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

  const getLocalRoutes = (): RouteRecordRaw[] => cloneDeep(customRoutes)
  const resetRoutes = () => {
    router.clearRoutes()
    cloneDeep(builtinRoutes).forEach((route) => router.addRoute(route))
  }

  useProgressGuard(router)
  useAccessGuard(router)
  useDocumentTitleGuard(router)

  watch(router.currentRoute, (route) => usePageService(router).addOpenedPage(route))

  resetRoutes()

  return { getLocalRoutes, resetRoutes, router }
}

function convertGlobResult(result: Record<string, unknown>) {
  return Object.values(result)
    .map((item) => (item as Record<string, any>).default)
    .flat()
}

export const { getLocalRoutes, resetRoutes, router } = createVueRouter()
