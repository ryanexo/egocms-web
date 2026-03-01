import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import { usePersistStorage } from '@/stores/providers/persist-storage.ts'

export { useAppStore } from '@/stores/modules/app.store.ts'
export { useAuthStore } from '@/stores/modules/auth.store.ts'
export { usePageStore } from '@/stores/modules/page.store.ts'
export { useRouterStore } from '@/stores/modules/router.store.ts'

export const pinia = createPinia().use(
  createPersistedState({
    serializer: {
      deserialize: (v) => v as unknown as Record<string, any>,
      serialize: (v) => v as unknown as string,
    },
    storage: usePersistStorage(),
  }),
)
