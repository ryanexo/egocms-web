import 'vue-router'

export interface IRoute {
  component: string
  id: string
  meta: Partial<IRouteMeta>
  parentId: string
  path: string
}

export interface IRouteMeta {
  affix: boolean
  affixCancelable: boolean
  externalUrl: string
  hiddenInMenu: boolean
  icon: string
  isRoot: boolean
  permission: string[]
  query: Record<string, any>
  requiresAuth: boolean
  sequence: string
  title: string
}

declare module 'vue-router' {
  interface RouteMeta extends Partial<IRouteMeta> {
    parent?: string
  }
}
