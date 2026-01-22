export interface AuthStoreState {
  expires: Date | number | string
  permission: Set<string>
  token: string
  unauthorizedHandler?: () => Promise<boolean>
}
