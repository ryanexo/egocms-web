import type { Arrayable } from '@vueuse/core'
import type { Pinia } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

import { isNil, trimEnd } from 'es-toolkit'
import { castArray } from 'es-toolkit/compat'
import { defineStore } from 'pinia'
import { defineAsyncComponent, defineComponent, h } from 'vue'

import type {
  RouteGenerationContext,
  RouterContextProvider,
  RouterStoreState,
} from '@/stores/types/router'

import { useAsyncComponentSkeleton } from '@/components/skeleton/AsyncComponentSkelton.tsx'
import { trans } from '@/locales'
import { getLocalRoutes } from '@/router'

export function createRouterStore(pinia: Pinia) {
  const store = defineStore('store.router', {
    actions: {
      $reset() {
        this.loaded = false
        this.parentRouteMap = new Map()
        this.routeMap = new Map()
        this.routes = []
        this.whitelist = new Set()
      },
      async generateRoutes(srv: RouterContextProvider) {
        const { parentRouteMap, routeMap, routes } = await generateRoutes(srv)
        routes.forEach((route) => srv.addRoute(route))

        this.routes = routes
        this.routeMap = routeMap
        this.parentRouteMap = parentRouteMap
        this.loaded = true
      },
      getRootRoutes() {
        return this.routes.filter((route) => {
          const children = this.routeMap.get(route.name as string)?.children
          return !Array.isArray(children) || children.length === 0
        })
      },
      isRouteInWhitelist(path: string) {
        return this.whitelist.has(path)
      },
      setHomePath(path: string) {
        if (path === '/') {
          throw new Error(trans('common.app.error.setHomePath'))
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

export function useAsyncComponentName(name: string, component: ImportFn) {
  return async () => {
    const originalComponent = defineAsyncComponent({
      loader: () => component().then((result) => result.default ?? result),
      loadingComponent: useAsyncComponentSkeleton('article'),
    })
    return defineComponent({
      name,
      setup(props, { attrs, slots }) {
        return () => h(originalComponent, { ...props, ...attrs }, slots)
      },
    })
  }
}

function getFlatLocalRoutes() {
  const flatRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
    const result: RouteRecordRaw[] = []
    const flatStack: RouteRecordRaw[] = []

    for (let i = routes.length - 1; i >= 0; i--) {
      flatStack.push(routes[i] as RouteRecordRaw)
    }

    while (flatStack.length > 0) {
      const route = flatStack.pop() as RouteRecordRaw

      if (route.children && route.children.length > 0) {
        for (let i = route.children.length - 1; i >= 0; i--) {
          const child = route.children?.[i] as RouteRecordRaw
          const path = child.path.startsWith('/') ? child.path : [route.path, child.path].join('/')

          flatStack.push({ ...child, meta: { ...child.meta, parent: route.name as string }, path })
        }
      }

      result.push(route)
    }

    return result
  }

  return flatRoutes(getLocalRoutes())
}

async function generateRoutes(srv: RouterContextProvider) {
  const originalRoutes = await srv.fetchRoutes()
  const components = srv.fetchComponents()
  const parentRouteMap = new Map<string, RouteRecordRaw>()
  const routeMap = new Map<string, RouteRecordRaw>()
  const routes: RouteRecordRaw[] = []
  const resolvedPath = new Map<string, string>()

  const composeFullPath = (name: string): string | undefined => {
    const resolved = resolvedPath.get(name)
    if (resolved) {
      return resolved
    }

    const route = routeMap.get(name)
    if (!route) {
      return
    }

    const currentPath = trimEnd(route.path, '/')
    const parentPath = route.meta?.parent ? composeFullPath(route.meta.parent) : undefined
    const path = [parentPath, currentPath].filter((path) => !isNil(path)).join('/')
    const finalPath = path.startsWith('/') ? path : '/' + path

    resolvedPath.set(name, finalPath)

    return finalPath
  }

  getFlatLocalRoutes().forEach((route) => {
    if (typeof route.name === 'string' && route.name.length > 0) {
      routeMap.set(route.name, route)
    }
  })

  originalRoutes.forEach((item) => {
    if (routeMap.has(item.id)) {
      console.error(`页面id / 静态路由name 发生冲突: ${item.id}`, routeMap.get(item.id))
      return
    }

    const hasSuffix = ['vue', 'tsx', 'ts'].some((suffix) => item.component.endsWith('.' + suffix))
    const endIndex = hasSuffix ? item.component.lastIndexOf('.') : item.component.length
    const componentPath = item.component.substring(0, endIndex)

    let component: ImportFn | undefined = components[componentPath]
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

  routeMap.forEach((route) => {
    const parent = isNil(route.meta?.parent) ? undefined : routeMap.get(route.meta.parent)
    if (parent) {
      parentRouteMap.set(route.name as string, parent)
      parent.children?.push(route)
    } else {
      routes.push(route)
    }
  })

  routeMap.forEach((route) => {
    const path = composeFullPath(route.name as string)
    if (path) {
      route.path = path
    }
    if (route.children && route.children.length > 0) {
      route.redirect = { name: route.children?.[0]?.name }
    }
  })

  return { parentRouteMap, routeMap, routes } as RouteGenerationContext
}
