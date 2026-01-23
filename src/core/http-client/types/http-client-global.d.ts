declare interface HttpResponse<T = any> {
  code: string
  data?: T
  msg: string
}
