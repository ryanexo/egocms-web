import type { RouteMeta } from 'vue-router'

export interface PageMeta extends Pick<
  RouteMeta,
  'affix' | 'affixCancelable' | 'externalUrl' | 'icon' | 'title'
> {
  id: string
}

export interface PageStoreState {
  currentPage: string
  openedPages: string[]
  pageMap: Map<string, PageMeta>
  pageVisible: boolean
  repo?: PageStoreRepo
  skipCache: Set<string>
  stickyPages: string[]
}

export type PersistableState = Omit<PageStoreState, 'pageVisible' | 'repo'>

export interface PageStoreRepo {
  pull(): PersistableState
  push(state: PersistableState): void
}
