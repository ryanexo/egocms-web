import type { StorageLike } from 'pinia-plugin-persistedstate'

import { appStorage } from '@/core/storage'

export function usePersistStorage(): StorageLike {
  return {
    getItem(key: string): null | string {
      return appStorage.get(key)
    },
    setItem(key: string, value: string): void {
      appStorage.set(key, value)
    },
  }
}
