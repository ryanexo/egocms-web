import { debounce } from 'es-toolkit'

import type { PageMeta, PageStoreRepo, PageStoreState, PersistableState } from '@/stores/types/page'

import { appStorage } from '@/core/storage'
import { StorageKey } from '@/core/storage/constants.ts'

interface LocalPageStoreData extends Omit<
  PageStoreState,
  'pages' | 'pageVisible' | 'pined' | 'skipCache'
> {
  pageMap: PageMeta[]
  pinSet: string[]
  skipCacheSet: string[]
}

export function usePageStoreRepo(): PageStoreRepo {
  const store = appStorage.local

  const pull: PageStoreRepo['pull'] = () => {
    let state: LocalPageStoreData = {
      currentPage: '',
      openedPages: [],
      pageMap: [],
      pinSet: [],
      skipCacheSet: [],
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
      pages: new Map(state.pageMap.map((item) => [item.id, item])),
      pined: new Set(state.pinSet),
      skipCache: new Set(state.skipCacheSet),
    }
  }
  const push: PageStoreRepo['push'] = debounce((state: PersistableState) => {
    store.set(StorageKey.Page, {
      currentPage: state.currentPage,
      openedPages: state.openedPages,
      pageMap: [...state.pages.values()],
      pinSet: [...state.pined],
      skipCacheSet: [...state.skipCache],
    } as LocalPageStoreData)
  }, 300)

  return { pull, push }
}
