export interface CreateOptions {
  authn: AuthnService
  redirector: AuthnGateway
}

export interface AuthStoreState {
  expires: Date | number | string
  permission: Set<string>
  token: string
}

export type UnauthorizedHandler = () => Promise<boolean>

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

export interface AuthnGateway {
  requireAuthentication(): void
}

export interface AuthnParams {
  [key: string]: any

  password: string
  username: string
}
