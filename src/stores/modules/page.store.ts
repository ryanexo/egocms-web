import type { Pinia } from 'pinia'

import { promiseTimeout } from '@vueuse/core'
import { defineStore } from 'pinia'
import { nextTick } from 'vue'

import type { PageMeta, PageStoreRepo, PageStoreState } from '@/stores/types/page-tab.store'

export function createPageStore(pinia: Pinia) {
  const store = defineStore('PageStore', {
    actions: {
      closePage(id: string) {
        const index = this.openedPages.findIndex((pageId) => pageId === id)
        if (index > -1) {
          this.pageMap.delete(id)
          this.openedPages.splice(index, 1)
        }
      },
      openPage(page: PageMeta) {
        if (!this.pageMap.has(page.id)) {
          this.openedPages.push(page.id)
        }
        this.pageMap.set(page.id, page)
      },
      async refreshCurrentPage() {
        this.pageVisible = false
        this.skipCache.add(this.currentPage)

        await nextTick()
        await promiseTimeout(100)

        this.skipCache.delete(this.currentPage)
        this.pageVisible = true
      },
      setRepo(repo: PageStoreRepo) {
        this.repo = repo
        this.$patch(repo.pull())
      },
    },
    getters: {
      currentPageWithMeta: (state) => {
        return state.pageMap.get(state.currentPage)
      },
      flatSkipCache: (state) => {
        return [...state.skipCache]
      },
      openedPageWithMeta: (state) => {
        return state.openedPages.map((id) => state.pageMap.get(id))
      },
    },
    state: (): PageStoreState => {
      return {
        currentPage: '',
        openedPages: [],
        pageMap: new Map(),
        pageVisible: true,
        skipCache: new Set(),
        stickyPages: [],
      }
    },
  })

  return () => {
    const s = store(pinia)

    s.$onAction(({ after, name, store }) => {
      const actions = new Set<typeof name>(['closePage', 'openPage'])
      after(() => actions.has(name) && store?.repo?.push(store.$state))
    })

    return s
  }
}
