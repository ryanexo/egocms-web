export interface AuthStoreState {
  authModalVisible: boolean
  expires: Date | number | string
  token: string
}
