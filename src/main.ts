import '@/assets/theme.css'
import '@/assets/main.css'
import { useTitle } from '@vueuse/core'
import { computed, createApp as createVueApp } from 'vue'

import App from '@/App.vue'
import { i18n, restoreLocale } from '@/locales'
import { router } from '@/router'
import { CoreRoutePathEnum } from '@/router/constants/route.enum.ts'
import { pinia, useAppStore, useAuthStore, useRouterStore } from '@/stores'
import { useAppUpdater } from '@/stores/adapters/app-updater.ts'

export async function createApp() {
  const app = createVueApp(App).use(pinia).use(i18n)

  const appStore = useAppStore()
  const authStore = useAuthStore()
  const routerStore = useRouterStore()

  await restoreLocale('zh-CN')

  useTitle(computed(() => appStore.pageTitleFormatted))

  appStore.setAppUpdater(useAppUpdater(30))
  routerStore.setHomePath(CoreRoutePathEnum.Dashboard)
  routerStore.setWhitelist([CoreRoutePathEnum.Login, CoreRoutePathEnum.Register])
  routerStore.setUnauthorizedRedirectPath(CoreRoutePathEnum.Login)

  /**
   * APP依赖Token运行，开发环境可设置一个非空Token以运行
   */
  authStore.setToken('')

  /**
   * router必须最后注册
   *
   * router会在注册后立即生效，导致应用在异步初始化方法完成前不正常运行
   */
  return app.use(router)
}

createApp().then((app) => app.mount('#app'))
