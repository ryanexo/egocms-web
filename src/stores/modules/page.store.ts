import type { Pinia } from 'pinia'

import { promiseTimeout } from '@vueuse/core'
import { castArray } from 'es-toolkit/compat'
import { defineStore } from 'pinia'
import { nextTick } from 'vue'

import type { PageMeta, PageStoreState } from '@/stores/types/page'

export function createPageStore(pinia: Pinia) {
  const store = defineStore('store.page', {
    actions: {
      closeAll(defaultPage: PageMeta) {
        this.$reset()
        this.openPage(defaultPage)
      },
      closeAllExceptCurrent() {
        this.closeLeadingPages()
        this.closeTrailingPages()
      },
      closeLeadingPages() {
        if (this.currentPageIndex <= 0) {
          return
        }
        purgePages(this.$state, this.openedPages.splice(0, this.currentPageIndex))
      },
      closePage(id: string) {
        const index = this.openedPages.findIndex((pageId) => pageId === id)
        if (index > -1) {
          this.pages.delete(id)
          this.openedPages.splice(index, 1)
        }
      },
      closeTrailingPages() {
        if (this.currentPageIndex >= this.openedPages.length - 1) {
          return
        }
        purgePages(
          this.$state,
          this.openedPages.splice(this.currentPageIndex, this.openedPages.length),
        )
      },
      movePage(id: string, pos: number) {
        if (this.currentPageIndex === -1) {
          return
        }
        if (this.currentPageIndex === pos || pos < 0 || pos >= this.openedPages.length) {
          return
        }
        if (pos > this.currentPageIndex) {
          pos -= 1
        }
        this.openedPages.splice(this.currentPageIndex, 1)
        this.openedPages.splice(pos, 0, id)
      },
      openPage(page: PageMeta) {
        if (!this.pages.has(page.id)) {
          this.openedPages.push(page.id)
        }
        if (page.affix) {
          this.pin(page.id)
        }
        this.pages.set(page.id, page)
      },
      pin(id: string) {
        this.pined.add(id)
      },
      async refreshCurrentPage() {
        this.pageVisible = false
        this.skipCache.add(this.currentPage)

        await nextTick()
        await promiseTimeout(100)

        this.skipCache.delete(this.currentPage)
        this.pageVisible = true
      },
      unpin(id: string) {
        this.pined.delete(id)
      },
    },
    getters: {
      currentPageIndex: (state) => {
        return state.openedPages.findIndex((id) => state.currentPage === id)
      },
      currentPageWithMeta: (state) => {
        return state.pages.get(state.currentPage)
      },
      flatSkipCache: (state) => {
        return [...state.skipCache]
      },
      openedPageWithMeta: (state) => {
        const stickied: PageMeta[] = []
        const statics: PageMeta[] = []

        state.openedPages.forEach((id) => {
          const pageMeta = state.pages.get(id)
          if (!pageMeta) {
            return
          }
          if (state.pined.has(id)) {
            stickied.push(pageMeta)
          } else {
            statics.push(pageMeta)
          }
        })

        return [...stickied, ...statics]
      },
    },
    persist: {
      pick: ['currentPage', 'openedPages', 'pages', 'pined', 'skipCache'],
    },
    state: (): PageStoreState => {
      return {
        currentPage: '',
        openedPages: [],
        pages: new Map(),
        pageVisible: true,
        pined: new Set(),
        skipCache: new Set(),
      }
    },
  })

  return () => store(pinia)
}

function purgePages(state: PageStoreState, pageIdList: string | string[]) {
  castArray(pageIdList).forEach((id) => {
    state.pages.delete(id)
    state.skipCache.delete(id)
    state.pined.delete(id)
  })
}
