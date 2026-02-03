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

  const findIndexByIdOrIndex = (idOrIndex: number | string) => {
    return typeof idOrIndex === 'number' ? idOrIndex : pageStore.opened.indexOf(idOrIndex)
  }
  const open: IPageService['open'] = (route) => {
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
    if (!pageStore.pages.has(page.id)) {
      pageStore.opened.push(page.id)
    }
    pageStore.pages.set(page.id, page)
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
  const closeOther: IPageService['closeOther'] = (idOrIndex: number | string) => {
    const currentIndex = pageStore.currentIndex
    const index = findIndexByIdOrIndex(idOrIndex)
    const id = pageStore.opened?.[index]

    if (index !== currentIndex && id) {
      currentRouter.push({ name: id })
    }

    closeBefore(index)
    closeAfter(index)
  }
  const closeBefore: IPageService['closeBefore'] = (idOrIndex: number | string) => {
    const index = findIndexByIdOrIndex(idOrIndex)
    if (index > 0) {
      purgePages(pageStore.opened.slice(0, index))
    }
  }
  const closeAfter: IPageService['closeAfter'] = (idOrIndex: number | string) => {
    const index = findIndexByIdOrIndex(idOrIndex)
    if (index >= 0 && index < pageStore.opened.length - 1) {
      purgePages(pageStore.opened.slice(index + 1, pageStore.opened.length))
    }
  }
  const close: IPageService['close'] = async (idOrIndex: number | string) => {
    const index = findIndexByIdOrIndex(idOrIndex)
    if (index === -1) {
      return
    }

    const id = pageStore.opened?.[index] as string
    if (pageStore.pined.has(id)) {
      return
    }

    pageStore.opened.splice(index, 1)
    pageStore.pages.delete(id)

    if (pageStore.current !== id) {
      return
    }

    const target = pageStore.opened[index] ?? pageStore.opened[index - 1]
    if (target) {
      return currentRouter.push({ name: target, query: pageStore.pages.get(target)?.query })
    }

    return openDefaultPage()
  }
  const move: IPageService['move'] = (idOrIndex: number | string, targetIndex: number) => {
    const currentIndex = findIndexByIdOrIndex(idOrIndex)
    if (currentIndex === targetIndex || targetIndex < 0 || targetIndex >= pageStore.opened.length) {
      return
    }
    if (targetIndex > currentIndex) {
      targetIndex -= 1
    }
    const id = pageStore.opened?.[currentIndex]
    if (id) {
      pageStore.opened.splice(currentIndex, 1)
      pageStore.opened.splice(targetIndex, 0, id)
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
  const refresh: IPageService['refresh'] = async () => {
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
    close,
    closeAfter,
    closeAll,
    closeBefore,
    closeOther,
    move,
    open,
    pin,
    refresh,
    unpin,
  }
}
