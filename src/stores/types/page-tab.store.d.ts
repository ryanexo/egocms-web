import type { RouteMeta } from 'vue-router'

export interface PageMeta extends Pick<
  RouteMeta,
  'affix' | 'affixCancelable' | 'externalUrl' | 'icon' | 'title'
> {
  id: string
}

export interface PageStoreState {
  currentPage: string
  readonly openedPages: string[]
  readonly pageMap: Map<string, PageMeta>
  readonly pageVisible: boolean
  readonly repo?: PageStoreRepo
  readonly skipCache: Set<string>
  readonly stickyPages: string[]
}

export type PersistableState = Omit<PageStoreState, 'pageVisible' | 'repo'>

export interface PageStoreRepo {
  pull(): PersistableState
  push(state: PersistableState): void
}
