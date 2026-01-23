import type { Pinia } from 'pinia'

import { defineStore } from 'pinia'

import type { AppStoreState } from '@/stores/types/app.store'

export function createAppStore(pinia: Pinia) {
  const store = defineStore('AppStore', {
    actions: {
      setPageTitle(title: string) {
        this.pageTitle = title
      },
    },
    getters: {
      pageTitleFormatted: (state) => {
        return [state.pageTitle, import.meta.env.VITE_APP_TITLE]
          .filter(Boolean)
          .join(' - ')
      },
    },
    state: (): AppStoreState => {
      return {
        pageTitle: '',
      }
    },
  })

  return () => store(pinia)
}
