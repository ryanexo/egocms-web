import type { UserCredentialParams } from '@/api/user/types/params'
import type { AuthnParams, AuthnResult, AuthnService } from '@/stores/types/auth'

import { userApi } from '@/api/user'

const authnService: AuthnService = {
  async login(credential: AuthnParams): Promise<AuthnResult> {
    const { token } = await userApi.login(credential as UserCredentialParams).result

    return {
      expires: 0,
      permission: [],
      token,
    }
  },
}

export { authnService }
