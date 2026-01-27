import 'vue-router'
import type { RouteMeta } from 'vue-router'

export {}

export interface IRoute {
  component: string
  id: string
  meta: RouteMeta
  parentId: string
  path: string
  sequence: string
}

export interface IRouteMeta {
  affix?: boolean
  affixCancelable?: boolean
  externalUrl?: string
  icon: string
  isRoot?: boolean
  permission: string[]
  query?: Record<string, any>
  requiresAuth: boolean
  sequence?: string
  title: string
}

declare module 'vue-router' {
  interface RouteMeta extends IRouteMeta {
    parent?: string
  }
}
