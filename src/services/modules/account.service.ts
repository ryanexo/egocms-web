import { useRouter } from 'vue-router'

import type { UserCredentialParams } from '@/api/user/types/params'
import type { IAccountService } from '@/services/types/account.service'

import { userApi } from '@/api/user'
import { trans } from '@/locales'
import { useAuthStore, useRouteStore } from '@/stores'

export function useAccountService(): IAccountService {
  const router = useRouter()

  const login: IAccountService['login'] = async (credential) => {
    const { token } = await userApi.login(credential as UserCredentialParams, {
      successMessage: trans('auth.login.loginSuccessful'),
    }).result
    const authStore = useAuthStore()
    const routeStore = useRouteStore()

    authStore.setToken(token)
    authStore.setPermission([])

    await router.push({ path: routeStore.homePath })
  }

  return { login }
}
