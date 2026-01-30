declare interface HttpResponse<T = any> {
  code: string
  data?: T
  msg: string
}

declare interface QueryResult<T> {
  abort(): void
  result: Promise<T>
  signal: AbortSignal
}
