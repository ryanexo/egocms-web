import type { Pinia } from 'pinia'

import { defineStore } from 'pinia'

import type { Page, PageStoreState } from '@/stores/types/page'

export function createPageStore(pinia: Pinia) {
  const store = defineStore('store.page', {
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

  return () => store(pinia)
}
