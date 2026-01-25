import type { Pinia } from 'pinia'

import { useIntervalFn } from '@vueuse/core'
import { defineStore } from 'pinia'

import type { AppStoreState, AppUpdater } from '@/stores/types/app.store'

export function createAppStore(pinia: Pinia) {
  let updaterCloser: Callable | undefined = undefined

  const store = defineStore('AppStore', {
    actions: {
      setAppUpdater(updater: AppUpdater) {
        updaterCloser?.()
        updaterCloser = watchAppVersion(updater)
      },
      setPageTitle(title: string) {
        this.pageTitle = title
      },
    },
    getters: {
      pageTitleFormatted: (state) => {
        return [state.pageTitle, import.meta.env.VITE_APP_TITLE].filter(Boolean).join(' - ')
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

function watchAppVersion(updater: AppUpdater) {
  const { abort, signal } = new AbortController()
  const { pause, resume } = useIntervalFn(
    () => {
      pause()
      updater
        .isLatestVersion(signal)
        .then((isLatest) => {
          if (!signal.aborted && !isLatest) {
            return updater.confirm()
          }
          return true
        })
        .then((canRefresh) => canRefresh && window.location.reload())
        .finally(() => !signal.aborted && resume())
    },
    updater.getUpdateFrequencySeconds() * 1000,
    { immediate: true },
  )

  signal.addEventListener('abort', () => updater.cancel())

  return () => abort()
}
