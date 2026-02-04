import type { LocationQueryRaw, RouteMeta } from 'vue-router'

export type Page = Pick<
  RouteMeta,
  'alwaysPined' | 'defaultPined' | 'externalUrl' | 'icon' | 'title'
> & {
  fullPath: string
  id: string
  path: string
  query?: LocationQueryRaw
}

export interface PageStoreState {
  current: string
  opened: string[]
  pages: Map<string, Page>
  pined: Set<string>
  skipCache: Set<string>
  visible: boolean
}
