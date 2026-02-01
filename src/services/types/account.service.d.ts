export interface IAccountService {
  login(credential: AuthnParams): Promise<void>
}

export interface AuthnParams {
  [key: string]: any

  password: string
  username: string
}
