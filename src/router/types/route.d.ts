import 'vue-router'

export {}

export interface Route {
  canAccess?: () => boolean

  externalUrl?: string
  icon: string
  order: number
  params?: Record<string, any>
  requiresAuth: boolean
  title: string
}

declare module 'vue-router' {
  /* eslint-disable @typescript-eslint/no-empty-object-type */
  interface RouteMeta extends Route {}
}
