import type { RouteRecordRaw } from 'vue-router'

export interface RouteGenerationContext {
  parentRouteMap: RouteStoreState['parentRouteMap']
  routeMap: RouteStoreState['routeMap']
  routes: RouteRecordRaw[]
}

export interface RouterContextProvider {
  addRoute(route: RouteRecordRaw): void
  fetchComponents(): GlobResults
  fetchRoutes(): Promise<IRoute[]>
  resolveNotExistsComponent(originalPath: string): ImportFn
}

export interface RouteStoreState {
  homePath?: string
  loaded: boolean
  parentRouteMap: Map<string, RouteRecordRaw>
  routeMap: Map<string, RouteRecordRaw>
  routes: RouteRecordRaw[]
  unauthorizedRedirectPath: string
  whitelist: Set<string>
}
