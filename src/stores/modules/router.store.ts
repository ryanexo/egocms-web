import type { Arrayable } from '@vueuse/core'
import type { Pinia } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

import { castArray } from 'es-toolkit/compat'
import { defineStore } from 'pinia'
import { defineAsyncComponent, defineComponent, h } from 'vue'

import type {
  RouteGenerationContext,
  RouterContextProvider,
  RouterStoreState,
} from '@/stores/types/router'

import { useAsyncComponentSkeleton } from '@/components/skeleton/AsyncComponentSkelton.tsx'
import { messageService } from '@/core/services/MessageService.ts'

export function createRouterStore(pinia: Pinia) {
  const store = defineStore('RouterStore', {
    actions: {
      async generateRoutes(srv: RouterContextProvider) {
        const message = messageService.loading('正在加载菜单', { duration: 0 })
        const { parentRouteMap, routeMap, routes } = await generateRoutes(srv)
        routes.forEach((route) => srv.addRoute(route))
        message.then((closer) => closer.close())

        this.routes = routes
        this.routeMap = routeMap
        this.parentRouteMap = parentRouteMap
        this.loaded = true
      },
      isRouteInWhitelist(path: string) {
        return this.whitelist.has(path)
      },
      setHomePath(path: string) {
        if (path === '/') {
          throw new Error(`HomePath不能为'/'`)
        }
        this.homePath = path
      },
      setUnauthorizedRedirectPath(path: string) {
        this.whitelist.delete(this.unauthorizedRedirectPath)
        this.whitelist.add(path)
        this.unauthorizedRedirectPath = path
      },
      setWhitelist(whitelist: Arrayable<string>, replace: boolean = true) {
        const list = castArray(whitelist)
        if (replace) {
          this.whitelist = new Set(list)
        } else {
          list.forEach((path) => this.whitelist.add(path))
        }
      },
    },
    state: (): RouterStoreState => {
      return {
        homePath: '',
        loaded: false,
        parentRouteMap: new Map(),
        routeMap: new Map(),
        routes: [],
        unauthorizedRedirectPath: '',
        whitelist: new Set(),
      }
    },
  })

  return () => store(pinia)
}

export function useAsyncComponentName(name: string, component: GlobFile) {
  return async () => {
    const originalComponent = defineAsyncComponent({
      loader: () =>
        new Promise((resolve) =>
          setTimeout(async () => {
            resolve((await component()).default)
          }, 3000),
        ),
      loadingComponent: useAsyncComponentSkeleton('article'),
    })
    return defineComponent({
      name: `route-${name}`,
      setup(props, { attrs, slots }) {
        return () => h(originalComponent, { ...props, ...attrs }, slots)
      },
    })
  }
}

async function generateRoutes(srv: RouterContextProvider) {
  const originalRoutes = await srv.fetchRoutes()
  const components = srv.fetchComponents()
  const parentRouteMap = new Map<string, RouteRecordRaw>()
  const routeMap = new Map<string, RouteRecordRaw>()
  const routes: RouteRecordRaw[] = []

  originalRoutes.forEach((item) => {
    const hasSuffix = ['vue', 'tsx', 'ts'].some((suffix) => item.component.endsWith('.' + suffix))
    const endIndex = hasSuffix ? item.component.lastIndexOf('.') : item.component.length
    const componentPath = item.component.substring(0, endIndex)

    let component: GlobFile | undefined = components[componentPath]
    if (!component) {
      console.error(`页面组件不存在: ${item.component}`)
      component = srv.resolveNotExistsComponent(item.component)
    }

    const route: RouteRecordRaw = {
      children: [],
      component: useAsyncComponentName(item.id, component),
      meta: {
        externalUrl: item.meta.externalUrl,
        icon: item.meta.icon,
        parent: item.parentId,
        permission: item.meta.permission,
        query: item.meta.query,
        requiresAuth: item.meta.requiresAuth,
        sequence: item.meta.sequence,
        title: item.meta.title,
      },
      name: item.id,
      path: item.path,
    }

    routeMap.set(item.id, route)
  })

  originalRoutes.forEach((item) => {
    const route = routeMap.get(item.id)
    if (route) {
      if (routeMap.has(item.parentId)) {
        routeMap.get(item.parentId)?.children?.push(route)
      } else {
        routes.push(route)
      }
    }
  })

  return { parentRouteMap, routeMap, routes } as RouteGenerationContext
}
