import { acceptHMRUpdate, defineStore } from 'pinia'

import type { Page, PageStoreState } from '@/stores/types/page'

const usePageStore = defineStore('store.page', {
  getters: {
    currentIndex: (state) => {
      return state.opened.indexOf(state.current)
    },
    currentPage: (state) => {
      return state.pages.get(state.current)
    },
    flatSkipCache: (state) => {
      return [...state.skipCache]
    },
    openedPages: (state) => {
      return state.opened.map((id) => state.pages.get(id) as Page)
    },
  },
  persist: {
    pick: ['current', 'opened', 'pages', 'pined', 'skipCache'],
  },
  state: (): PageStoreState => {
    return {
      current: '',
      opened: [],
      pages: new Map(),
      pined: new Set(),
      skipCache: new Set(),
      visible: true,
    }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot))
}

export { usePageStore }
