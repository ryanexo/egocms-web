import { useRouter } from 'vue-router'

import type { UserCredentialParams } from '@/api/user/types/params'
import type { IAccountService } from '@/services/types/account.service'

import { userApi } from '@/api/user'
import { useAuthStore, useRouteStore } from '@/stores'

export function useAccountService(): IAccountService {
  const login: IAccountService['login'] = async (credential) => {
    const { token } = await userApi.login(credential as UserCredentialParams).result

    const authStore = useAuthStore()
    const router = useRouter()
    const routeStore = useRouteStore()

    authStore.setToken(token)
    authStore.setPermission([])

    await router.push({ path: routeStore.homePath })
  }

  return { login }
}
