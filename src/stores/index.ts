import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import { usePersistStorage } from '@/stores/adapters/persist-storage.ts'
import { createAppStore } from '@/stores/modules/app.store.ts'
import { createAuthStore } from '@/stores/modules/auth.store.ts'
import { createPageStore } from '@/stores/modules/page.store.ts'
import { createRouterStore } from '@/stores/modules/router.store.ts'

export const pinia = createPinia().use(
  createPersistedState({
    serializer: {
      deserialize: (v) => v as unknown as Record<string, any>,
      serialize: (v) => v as unknown as string,
    },
    storage: usePersistStorage(),
  }),
)

export const useAppStore = createAppStore(pinia)
export const useRouterStore = createRouterStore(pinia)
export const useAuthStore = createAuthStore(pinia)
export const usePageStore = createPageStore(pinia)
