import type { RouteRecordRaw } from 'vue-router'

export interface RouteGenerationContext {
  parentRouteMap: RouterStoreState['parentRouteMap']
  routeMap: RouterStoreState['routeMap']
  routes: RouteRecordRaw[]
}

export interface RouterContextProvider {
  addRoute(route: RouteRecordRaw): void
  fetchComponents(): GlobResults
  fetchRoutes(): Promise<IRoute[]>
  resolveNotExistsComponent(filePath: string): GlobFile
}

export interface RouterStoreState {
  homePath: string
  readonly loaded: boolean
  parentRouteMap: Map<string, RouteRecordRaw>
  routeMap: Map<string, RouteRecordRaw>
  routes: RouteRecordRaw[]
  unauthorizedRedirectPath: string
  whitelist: Set<string>
}
