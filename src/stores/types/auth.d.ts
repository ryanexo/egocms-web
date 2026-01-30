export interface AuthStoreState {
  expires: Date | number | string
  permission: Set<string>
  token: string
  unauthorizedHandler?: () => Promise<boolean>
}

export interface Permission {
  perm: string[]
  scope: string
}

export interface AuthnResult {
  expires: Date | number | string
  permission: Permission[]
  token: string
}

export interface AuthnService {
  login(credential: AuthnParams): Promise<AuthnResult>
}

export interface AuthnParams {
  [key: string]: any

  password: string
  username: string
}
