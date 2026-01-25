import type { Pinia } from 'pinia'

import { defineStore } from 'pinia'

import type { PageTabStoreState } from '@/stores/types/page-tab.store'

export function createPageTabStore(pinia: Pinia) {
  const store = defineStore('PageTabStore', {
    actions: {},
    state: (): PageTabStoreState => {
      return { pageVisible: true }
    },
  })

  return () => store(pinia)
}
