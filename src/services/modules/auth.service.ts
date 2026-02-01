import { useRouter } from 'vue-router'

import type { AuthenticationContext, IAuthService } from '@/services/types/authn.service'

import { CoreRouteNameEnum } from '@/router/constants/route.enum.ts'
import { useAuthStore } from '@/stores'

export function createAuthService(): IAuthService {
  const startAuthentication = (context: AuthenticationContext) => {
    const query: Record<string, any> = {}
    if (context.redirect) {
      query.redirect = encodeURIComponent(context.redirect)
    }
    useRouter().push({ name: CoreRouteNameEnum.Login, query })
  }
  const reauthentication = (context: AuthenticationContext) => {
    startAuthentication(context)
  }
  const invalidateSession: IAuthService['invalidateSession'] = (context = {}) => {
    const store = useAuthStore()
    const hasToken = store.token !== ''

    store.$reset()

    if (hasToken) {
      reauthentication(context)
    } else {
      startAuthentication(context)
    }
  }

  return { invalidateSession }
}
