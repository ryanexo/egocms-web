import type { StorageLike } from 'pinia-plugin-persistedstate'

import { storage } from '@/core/storage'

export function usePersistStorage(): StorageLike {
  return {
    getItem(key: string): null | string {
      return storage.get(key)
    },
    setItem(key: string, value: string): void {
      storage.set(key, value)
    },
  }
}
