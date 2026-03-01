import { useTimeoutPoll } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'

import type { AppStoreState, AppUpdater } from '@/stores/types/app'

let updaterCloser: Callable | undefined = undefined

const useAppStore = defineStore('store.app', {
  actions: {
    setAppUpdater(updater: AppUpdater) {
      updaterCloser?.()
      updaterCloser = watchAppVersion(updater)
    },
    setPageTitle(title: string) {
      this.pageTitle = title
    },
    toggleSidebarCollapsed() {
      this.sidebarCollapsed = !this.sidebarCollapsed
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
      sidebarCollapsed: false,
    }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}

function watchAppVersion(updater: AppUpdater) {
  const controller = new AbortController()
  const { signal } = controller
  const abort = () => controller.abort()

  const { pause } = useTimeoutPoll(
    async () => {
      if (signal.aborted) {
        return
      }
      const isLatest = await updater.isLatestVersion(signal)
      if (isLatest) {
        return
      }
      const canRefresh = await updater.confirm()
      if (canRefresh) {
        window.location.reload()
      } else {
        abort()
      }
    },
    updater.getUpdateFrequencySeconds() * 1000,
    { immediate: true, immediateCallback: true },
  )

  signal.addEventListener('abort', () => {
    updater.cancel()
    pause()
  })

  return () => abort()
}

export { useAppStore }
