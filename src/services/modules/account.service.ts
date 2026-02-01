import { useRouter } from 'vue-router'

import type { UserCredentialParams } from '@/api/user/types/params'
import type { IAccountService } from '@/services/types/account.service'

import { userApi } from '@/api/user'
import { useAuthStore, useRouterStore } from '@/stores'

export function createAccountService(): IAccountService {
  const login: IAccountService['login'] = async (credential) => {
    const { token } = await userApi.login(credential as UserCredentialParams).result

    const authStore = useAuthStore()
    const router = useRouter()
    const routerStore = useRouterStore()

    authStore.setToken(token)
    authStore.setPermission([])

    await router.push({ path: routerStore.homePath })
  }

  return { login }
}
