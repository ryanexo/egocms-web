/**
 * dto.UserCredentialParams
 */
export interface UserCredentialParams {
  password: string
  username: string
}

/**
 * dto.UserAuthnResult
 */
export interface DtoUserAuthnResult {
  detail?: DtoUser
  token?: string
}

/**
 * dto.User
 */
export interface DtoUser {
  createdAt?: string
  email?: string
  id?: string
  ip?: string
  profile?: DtoUserProfile
  roleId?: string
  roleName?: string
  status?: number
  updatedAt?: string
  username?: string
}

/**
 * dto.UserProfile
 */
export interface DtoUserProfile {
  avatar?: string
  city?: string
  country?: string
  description?: string
  gender?: number
  nickname?: string
  province?: string
}

/**
 * dto.UserCreateParams
 */
export interface UserCreateParams {
  email: string
  password: string
  passwordConfirm: string
  username: string
}
