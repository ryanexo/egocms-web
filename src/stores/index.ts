import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

import { createAppStore } from '@/stores/modules/app.store.ts'
import { createAuthStore } from '@/stores/modules/auth.store.ts'
import { createRouterStore } from '@/stores/modules/router.store.ts'

export const pinia = createPinia().use(piniaPluginPersistedState)

export const useAppStore = createAppStore(pinia)
export const useRouterStore = createRouterStore(pinia)
export const useAuthStore = createAuthStore(pinia)
