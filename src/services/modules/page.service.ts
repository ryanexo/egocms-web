import type { Router } from 'vue-router'

import { promiseTimeout } from '@vueuse/core'
import { castArray } from 'es-toolkit/compat'
import { nextTick } from 'vue'
import { useRouter } from 'vue-router'

import type { IPageService } from '@/services/types/page.service'
import type { Page } from '@/stores/types/page'

import { CoreRouteNameEnum } from '@/router/constants/route.enum.ts'
import { usePageStore, useRouterStore } from '@/stores'

export function usePageService(router?: Router): IPageService {
  const currentRouter = router ?? useRouter()
  const routerStore = useRouterStore()
  const pageStore = usePageStore()

  const addOpenedPage: IPageService['addOpenedPage'] = (route) => {
    const page: Page = {
      affix: route.meta?.affix,
      affixCancelable: route.meta?.affixCancelable,
      externalUrl: route.meta?.externalUrl,
      fullPath: route.fullPath,
      icon: route.meta?.icon,
      id: String(route.name),
      path: route.path,
      query: route.query,
      title: route.meta?.title ?? '',
    }
    pageStore.pages.set(page.id, page)
    pageStore.opened.push(page.id)
    pageStore.current = page.id
    if (page.affix) {
      pageStore.pined.add(page.id)
    }
  }
  const openDefaultPage = async () => {
    const path = routerStore.homePath ?? CoreRouteNameEnum.Home
    return currentRouter.push(path)
  }
  const closeAll: IPageService['closeAll'] = () => {
    pageStore.$reset()
    return openDefaultPage()
  }
  const closeAllExceptCurrent: IPageService['closeAllExceptCurrent'] = () => {
    closeLeadingPages()
    closeTrailingPages()
  }
  const closeLeadingPages: IPageService['closeLeadingPages'] = () => {
    if (pageStore.currentIndex === -1) {
      return
    }
    purgePages(pageStore.opened.slice(0, pageStore.currentIndex))
  }
  const closeTrailingPages: IPageService['closeTrailingPages'] = () => {
    if (pageStore.currentIndex === -1) {
      return
    }
    purgePages(pageStore.opened.slice(pageStore.currentIndex + 1, pageStore.opened.length))
  }
  const closePage: IPageService['closePage'] = async (id: string) => {
    const index = pageStore.opened.findIndex((item) => item === id)
    if (index === -1) {
      return
    }

    pageStore.pages.delete(id)
    pageStore.opened.splice(index, 1)

    if (pageStore.current !== id) {
      return
    }

    const target = pageStore.opened[index] ?? pageStore.opened[index - 1]
    if (target) {
      return currentRouter.push({ name: target, query: pageStore.pages.get(target)?.query })
    }

    return openDefaultPage()
  }
  const movePage: IPageService['movePage'] = (id: string, pos: number) => {
    if (pageStore.currentIndex === -1) {
      return
    }
    if (pageStore.currentIndex === pos || pos < 0 || pos >= pageStore.opened.length) {
      return
    }
    if (pos > pageStore.currentIndex) {
      pos -= 1
    }
    const index = pageStore.opened.findIndex((item) => item === id)
    if (index !== -1) {
      pageStore.opened.splice(index, 1)
      pageStore.opened.splice(pos, 0, id)
    }
  }
  const pin: IPageService['pin'] = (id: string) => {
    pageStore.pined.add(id)
  }
  const unpin: IPageService['unpin'] = (id: string) => {
    const page = pageStore.pages.get(id)
    if (page?.affixCancelable !== true) {
      pageStore.pined.delete(id)
    }
  }
  const refreshCurrentPage: IPageService['refreshCurrentPage'] = async () => {
    pageStore.visible = false

    await nextTick()
    await promiseTimeout(200)

    pageStore.visible = true
  }
  /**
   * 清理页面关联数据，force=true时会强制清理固定页面
   */
  const purgePages = (idList: string | string[], force: boolean = false) => {
    const idSet = new Set(castArray(idList))

    idSet.forEach((id) => {
      if (force || !pageStore.pined.has(id)) {
        pageStore.pages.delete(id)
        pageStore.skipCache.delete(id)
        pageStore.pined.delete(id)
      }
    })
    pageStore.opened = pageStore.opened.filter((id) => {
      if (!idSet.has(id)) {
        return true
      }
      return pageStore.pined.has(id) && !force
    })
  }

  return {
    addOpenedPage,
    closeAll,
    closeAllExceptCurrent,
    closeLeadingPages,
    closePage,
    closeTrailingPages,
    movePage,
    pin,
    refreshCurrentPage,
    unpin,
  }
}
