export interface IAuthService {
  invalidateSession(context?: AuthenticationContext): void
}

export interface AuthenticationContext {
  redirect?: string
}
