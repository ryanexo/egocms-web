import type { Pinia } from 'pinia'
import type { Router, RouteRecordRaw } from 'vue-router'

import { trimStart } from 'es-toolkit'
import { defineStore } from 'pinia'
import { defineComponent, h, reactive, ref } from 'vue'

import type { IRoute } from '@/router/types/route'

export interface DynamicRouteOptions {
  addRoute: Router['addRoute']
  fetchRoutes: () => Promise<IRoute[]>
}

export interface RouteGenerationOptions {
  components: Components
  routes: IRoute[]
}

export interface RouterStoreState {
  routes: IRoute[]
}

type ComponentFile = () => Promise<{ default?: any }>

type Components = Record<string, ComponentFile>

const basePath = '../../pages'
const componentSuffix = ['vue', 'tsx', 'ts']

export function createRouterStore(pinia: Pinia) {
  const store = defineStore('RouterStore', () => {
    // const loaded = ref(false)
    // const routeMap = reactive(new Map<string, IRoute>())
    const routes = ref<IRoute[]>([])
    const components = getOriginalFiles()

    async function fetchRoutes(options: DynamicRouteOptions) {
      const data = await options.fetchRoutes()
      generateRoutes({ components, routes: data })

      routes.value = data
    }

    return reactive({ routes }) as RouterStoreState
  })

  return () => store(pinia)
}

function generateRoutes(options: RouteGenerationOptions): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = []

  options.routes.forEach((item) => {
    if (!isValidSuffix(item.component)) {
      console.error(`页面组件不合法: ${item.component}`)
      return
    }

    const componentPath = normalizeComponentUri(
      options.pathPrefix,
      item.component,
    )

    result.push({
      component: withComponentAlias(String(item.id)),
      name: String(item.id),
      path: item.path,
    })
  })

  return result
}

function getOriginalFiles() {
  const suffixPattern = componentSuffix.join(',')
  const files = import.meta.glob(`${basePath}/**/*.{${suffixPattern}}`)
  const result: Components = {}

  Object.entries(files).forEach(([path, component]) => {
    const uri = normalizeComponentUri(basePath, path)
    result[uri] = component as ComponentFile
  })

  return result
}

function normalizeComponentUri(prefix: string, uri: string): string {
  return trimStart(uri.replace(prefix, ''), '/')
}

function withComponentAlias(alias: string, component: ComponentFile) {
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
