import type { LocationQueryRaw, RouteMeta } from 'vue-router'

export interface Page extends Pick<
  RouteMeta,
  'affix' | 'affixCancelable' | 'externalUrl' | 'icon' | 'title'
> {
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
