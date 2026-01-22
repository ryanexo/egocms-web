import '@/assets/main.css'
import { useTitle } from '@vueuse/core'
import { computed, createApp as createVueApp } from 'vue'

import App from '@/App.vue'
import { router } from '@/router'
import { pinia, useAppStore, useAuthStore, useRouterStore } from '@/stores'

export async function createApp() {
  const app = createVueApp(App).use(pinia).use(router)
  const appStore = useAppStore()
  const authStore = useAuthStore()
  const routerStore = useRouterStore()

  useTitle(computed(() => appStore.pageTitleFormatted))

  routerStore.setHomePath('/')
  routerStore.setWhitelist(['/', '/register'])
  routerStore.setUnauthorizedRedirectPath('/login')

  authStore.setToken('test')

  return app
}

createApp().then((app) => app.mount('#app'))
