export interface UserApi {
  login: (
    data: UserCredentialParams,
    config?: Omit<AxiosRequestConfig, 'signal'>,
  ) => QueryResult<DtoUserAuthnResult>
  logout: (config?: Omit<AxiosRequestConfig, 'signal'>) => QueryResult<any>
  register: (
    data: UserCreateParams,
    config?: Omit<AxiosRequestConfig, 'signal'>,
  ) => QueryResult<string>
}
