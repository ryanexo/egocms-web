export interface AuthStoreState {
  expires: Date | number | string
  permission: Set<string>
  token: string
}

export interface Permission {
  perm: string[]
  scope: string
}
