import { useTitle } from '@vueuse/core'
import { computed, createApp as createVueApp } from 'vue'

import App from '@/App.vue'
import { startErrorCapture } from '@/core/errors'
import { i18n, restoreLocale } from '@/locales'
import { router } from '@/router'
import { CoreRoutePathEnum } from '@/router/constants/route.enum.ts'
import { pinia, useAppStore, useAuthStore, useRouteStore } from '@/stores'
import { useAppUpdater } from '@/stores/providers/app-updater.ts'
import '@/assets/main.css'

async function createApp() {
  const app = createVueApp(App).use(pinia).use(i18n)

  const appStore = useAppStore()
  const authStore = useAuthStore()
  const routeStore = useRouteStore()

  await restoreLocale('zh-CN')

  useTitle(computed(() => appStore.pageTitleFormatted))

  appStore.setAppUpdater(useAppUpdater(30))
  routeStore.setHomePath(CoreRoutePathEnum.Dashboard)
  routeStore.setWhitelist([CoreRoutePathEnum.Login, CoreRoutePathEnum.Register])
  routeStore.setUnauthorizedRedirectPath(CoreRoutePathEnum.Login)

  if (import.meta.env.DEV) {
    /**
     * APP依赖Token运行，开发环境可设置一个非空Token以运行
     */
    authStore.setToken('')
  }

  /**
   * router依赖store运行
   *
   * 必须在store完成初始化后注册
   */
  app.use(router)
  app.mount('#app')

  startErrorCapture(app, router)

  return app
}

createApp()
