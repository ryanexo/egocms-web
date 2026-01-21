import type { Pinia } from 'pinia'
import type { Router, RouteRecordRaw } from 'vue-router'

import { trimStart } from 'es-toolkit'
import { defineStore } from 'pinia'
import { defineComponent, h } from 'vue'

import type { IRoute } from '@/router/types/route'

export interface RouteContext {
  parentRouteMap: RouterStoreState['parentRouteMap']
  routeMap: RouterStoreState['routeMap']
  routes: RouteRecordRaw[]
}
export interface RouterStoreService {
  addRoute: Router['addRoute']
  fallbackComponent: PageComponentFile
  fetchRoutes(): Promise<IRoute[]>
}
export interface RouterStoreState {
  loaded: boolean
  parentRouteMap: Map<string, RouteRecordRaw>
  routeMap: Map<string, RouteRecordRaw>
  routes: RouteRecordRaw[]
}

type PageComponentFile = () => Promise<{ default?: any }>
type PageComponents = Record<string, PageComponentFile>

const basePath = '../../pages'
const componentSuffix = ['vue', 'tsx', 'ts']

export function createRouterStore(pinia: Pinia) {
  const components = getOriginalFiles()

  const store = defineStore('RouterStore', {
    actions: {
      async generateRoutes(srv: RouterStoreService) {
        const routeInfoList = await srv.fetchRoutes()
        const { parentRouteMap, routeMap, routes } = generateRoutes(
          routeInfoList,
          components,
          srv.fallbackComponent,
        )
        routes.forEach((route) => srv.addRoute(route))

        this.routes = routes
        this.routeMap = routeMap
        this.parentRouteMap = parentRouteMap
        this.loaded = true
      },
      getComponentFiles() {
        return { ...components }
      },
    },
    state: (): RouterStoreState => {
      return {
        loaded: false,
        parentRouteMap: new Map(),
        routeMap: new Map(),
        routes: [],
      }
    },
  })

  return () => store(pinia)
}

function generateRoutes(
  routeInfoList: IRoute[],
  components: PageComponents,
  fallbackComponent: RouterStoreService['fallbackComponent'],
): RouteContext {
  const parentRouteMap = new Map<string, RouteRecordRaw>()
  const routeMap = new Map<string, RouteRecordRaw>()
  const routes: RouteRecordRaw[] = []

  routeInfoList.forEach((item) => {
    const hasSuffix = componentSuffix.some((suffix) =>
      item.component.endsWith('.' + suffix),
    )
    const endIndex = hasSuffix
      ? item.component.lastIndexOf('.')
      : item.component.length
    const componentPath = item.component.substring(0, endIndex)

    let component: PageComponentFile | undefined = components[componentPath]
    if (!component) {
      console.error(`页面组件不存在: ${item.component}`)
      component = fallbackComponent
    }

    const route: RouteRecordRaw = {
      children: [],
      component: withComponentAlias(item.id, component),
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

  routeInfoList.forEach((item) => {
    const route = routeMap.get(item.id)
    if (route) {
      if (routeMap.has(item.parentId)) {
        routeMap.get(item.parentId)?.children?.push(route)
      } else {
        routes.push(route)
      }
    }
  })

  return { parentRouteMap, routeMap, routes }
}

function getOriginalFiles() {
  const suffixPattern = componentSuffix.join(',')
  const files = import.meta.glob(`${basePath}/**/*.{${suffixPattern}}`)
  const result: PageComponents = {}

  Object.entries(files).forEach(([path, component]) => {
    const uri = normalizeComponentUri(path)
    result[uri] = component as PageComponentFile
  })

  return result
}

function normalizeComponentUri(uri: string): string {
  return trimStart(uri.replace(basePath, ''), '/')
}

function withComponentAlias(alias: string, component: PageComponentFile) {
  return async () => {
    const originalComponent = await component()
    if (!originalComponent.default) {
      return originalComponent
    }
    return defineComponent({
      name: `route-${alias}`,
      setup(props, { attrs, slots }) {
        return () => h(originalComponent, { ...props, ...attrs }, slots)
      },
    })
  }
}
