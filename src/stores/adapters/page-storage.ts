import { debounce } from 'es-toolkit'

import type { PageMeta, PageStoreRepo, PageStoreState } from '@/stores/types/page'

import { appStorage } from '@/core/storage'
import { StorageKey } from '@/core/storage/constants.ts'

interface LocalPageStoreData extends Omit<PageStoreState, 'pageMap' | 'pageVisible' | 'skipCache'> {
  pageList: PageMeta[]
  skipCacheList: string[]
}

export function usePageStoreRepo(): PageStoreRepo {
  const store = appStorage.local

  const pull: PageStoreRepo['pull'] = () => {
    let state: LocalPageStoreData = {
      currentPage: '',
      openedPages: [],
      pageList: [],
      skipCacheList: [],
      stickyPages: [],
    }

    try {
      const data = store.get(StorageKey.Page)
      if (data) {
        state = data
      }
    } catch {
      /* empty */
    }

    return {
      currentPage: state.currentPage,
      openedPages: state.openedPages,
      pageMap: new Map(state.pageList.map((item) => [item.id, item])),
      skipCache: new Set(state.skipCacheList),
      stickyPages: state.stickyPages,
    }
  }
  const push: PageStoreRepo['push'] = debounce((state) => {
    store.set(StorageKey.Page, {
      currentPage: state.currentPage,
      openedPages: state.openedPages,
      pageList: [...state.pageMap.values()],
      skipCacheList: [...state.skipCache],
      stickyPages: state.stickyPages,
    } as LocalPageStoreData)
  }, 300)

  return { pull, push }
}
