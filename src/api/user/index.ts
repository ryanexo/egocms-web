import type {
  DtoUserAuthnResult,
  UserCreateParams,
  UserCredentialParams,
} from '@/api/user/types/params'
import type { UserApi } from '@/api/user/types/userApi.port'

import { defineQuery, defineQueryNoData } from '@/core/http-client/utils/query.ts'

export type { UserApi } from '@/api/user/types/userApi.port'

const login = defineQuery<UserCredentialParams, DtoUserAuthnResult>((httpClient, data, config) => {
  return httpClient.post('/user/login', data, config)
})
const logout = defineQueryNoData((httpClient, data, config) => {
  return httpClient.post('/user/logout', data, config)
})
const register = defineQuery<UserCreateParams, string>((httpClient, data, config) => {
  return httpClient.post('/user/register', data, config)
})

export const userApi: UserApi = { login, logout, register }
