import type { RouteRecordRaw } from 'vue-router'

export interface RouteContext {
  parentRouteMap: RouterStoreState['parentRouteMap']
  routeMap: RouterStoreState['routeMap']
  routes: RouteRecordRaw[]
}

export interface RouterStoreService {
  addRoute(route: RouteRecordRaw): void
  fetchComponents(): GlobResults
  fetchRoutes(): Promise<IRoute[]>
  resolveNotExistsComponent(filePath: string): GlobFile
}

export interface RouterStoreState {
  homePath: string
  loaded: boolean
  parentRouteMap: Map<string, RouteRecordRaw>
  routeMap: Map<string, RouteRecordRaw>
  routes: RouteRecordRaw[]
  unauthorizedRedirectPath: string
  whitelist: Set<string>
}
