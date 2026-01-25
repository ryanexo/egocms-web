import '@/assets/theme.css'
import '@/assets/main.css'
import { useTitle } from '@vueuse/core'
import { computed, createApp as createVueApp } from 'vue'

import App from '@/App.vue'
import { router } from '@/router'
import { CoreRoutePathEnum } from '@/router/constants/route.enum.ts'
import { pinia, useAppStore, useAuthStore, useRouterStore } from '@/stores'
import { useAppUpdater } from '@/stores/adapter/app-updater.adapter.ts'

export async function createApp() {
  const app = createVueApp(App).use(pinia).use(router)
  const appStore = useAppStore()
  const authStore = useAuthStore()
  const routerStore = useRouterStore()

  /* APP版本检查，每30秒检查一次 */
  const appUpdater = useAppUpdater(30)
  /* 页面标题，跟随路由变化 */
  const currentPageTitle = computed(() => appStore.pageTitleFormatted)

  useTitle(currentPageTitle)
  appStore.setAppUpdater(appUpdater)
  routerStore.setHomePath(CoreRoutePathEnum.Home)
  routerStore.setWhitelist([CoreRoutePathEnum.Login, CoreRoutePathEnum.Register])
  routerStore.setUnauthorizedRedirectPath(CoreRoutePathEnum.Login)

  /**
   * APP依赖Token运行，开发环境可设置一个非空Token以运行
   */
  authStore.setToken('')

  return app
}

createApp().then((app) => app.mount('#app'))
