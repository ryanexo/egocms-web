import type { AuthnGateway } from '@/stores/types/auth'

import { router } from '@/router'
import { CoreRouteNameEnum } from '@/router/constants/route.enum.ts'

export function createRedirector(): AuthnGateway {
  const redirectToAuthnPage: AuthnGateway['requireAuthentication'] = () =>
    router.push({ name: CoreRouteNameEnum.Login })

  return { requireAuthentication: redirectToAuthnPage }
}
