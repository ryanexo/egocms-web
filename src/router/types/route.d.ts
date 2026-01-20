import 'vue-router'

export {}

export interface IRoute extends IRouteMeta {
  children: IRoute[]
  component: string
  id: SafeNumber
  parentId: SafeNumber
  path: string
}

export interface IRouteMeta {
  icon: string
  linkUrl?: string
  permission: string[]
  query?: Record<string, any>
  requiresAuth: boolean
  sequence: SafeNumber
  title: string
}

declare module 'vue-router' {
  /* eslint-disable @typescript-eslint/no-empty-object-type */
  interface RouteMeta extends IRouteMeta {}
}
