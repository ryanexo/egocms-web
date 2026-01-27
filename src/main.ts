import '@/assets/theme.css'
import '@/assets/main.css'
import { useTitle } from '@vueuse/core'
import { computed, createApp as createVueApp } from 'vue'

import App from '@/App.vue'
import { router } from '@/router'
import { CoreRoutePathEnum } from '@/router/constants/route.enum.ts'
import { pinia, useAppStore, useAuthStore, usePageStore, useRouterStore } from '@/stores'
import { useAppUpdater } from '@/stores/adapters/app-updater.ts'
import { usePageStoreRepo } from '@/stores/adapters/page-storage.ts'

export async function createApp() {
  const app = createVueApp(App).use(pinia).use(router)
  const appStore = useAppStore()
  const authStore = useAuthStore()
  const routerStore = useRouterStore()
  const pageStore = usePageStore()

  useTitle(computed(() => appStore.pageTitleFormatted))

  appStore.setAppUpdater(useAppUpdater(30))
  routerStore.setHomePath(CoreRoutePathEnum.Dashboard)
  routerStore.setWhitelist([CoreRoutePathEnum.Login, CoreRoutePathEnum.Register])
  routerStore.setUnauthorizedRedirectPath(CoreRoutePathEnum.Login)
  pageStore.setRepo(usePageStoreRepo())

  /**
   * APP依赖Token运行，开发环境可设置一个非空Token以运行
   */
  authStore.setToken('test')

  return app
}

createApp().then((app) => app.mount('#app'))
