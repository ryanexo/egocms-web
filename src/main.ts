import '@/assets/theme.css'
import '@/assets/main.css'
import { useTitle } from '@vueuse/core'
import { computed, createApp as createVueApp } from 'vue'

import App from '@/App.vue'
import { i18n, restoreLocale } from '@/locales'
import { router } from '@/router'
import { CoreRoutePathEnum } from '@/router/constants/route.enum.ts'
import { pinia, useAppStore, useAuthStore, usePageStore, useRouterStore } from '@/stores'
import { useAppUpdater } from '@/stores/adapters/app-updater.ts'
import { usePageStoreRepo } from '@/stores/adapters/page-storage.ts'

export async function createApp() {
  const app = createVueApp(App)

  const appStore = useAppStore()
  const authStore = useAuthStore()
  const routerStore = useRouterStore()
  const pageStore = usePageStore()

  await restoreLocale('zh-CN')

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

  /**
   * vue plugin如无特殊要求尽量放在最后注册
   *
   * 部分plugin(如router)会在注册后立即生效，导致应用在异步初始化方法完成前不正常运行
   */
  return app.use(pinia).use(i18n).use(router)
}

createApp().then((app) => app.mount('#app'))
