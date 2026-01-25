import store from 'store2'

import { StorageScope } from '@/core/storage/constants.ts'

export const appStorage = store.namespace(StorageScope.App)
