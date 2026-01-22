export interface UserInfo {
  avatar: string
  id: string
  username: string
}

export interface UserStoreState {
  userData?: UserInfo
}
