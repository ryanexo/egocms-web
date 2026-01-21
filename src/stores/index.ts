import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

import { createAuthStore } from '@/stores/modules/AuthStore.ts'
import { createRouterStore } from '@/stores/modules/RouterStore.ts'

export const pinia = createPinia().use(piniaPluginPersistedState)

export const useRouterStore = createRouterStore(pinia)
export const useAuthStore = createAuthStore(pinia)
