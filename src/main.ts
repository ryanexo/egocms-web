import '@/assets/main.css'
import { createApp as createVueApp } from 'vue'

import App from '@/App.vue'
import { router } from '@/router'
import { pinia, useRouterStore } from '@/stores'

export async function createApp() {
  const app = createVueApp(App).use(pinia).use(router)
  const routerStore = useRouterStore()

  routerStore.setHomePath('/')
  routerStore.setWhitelist('/register')
  routerStore.setUnauthorizedRedirectPath('/login')

  return app
}

createApp().then((app) => app.mount('#app'))
