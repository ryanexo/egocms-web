export interface HttpClientConfig {
  policy: HttpClientPolicy
}

export interface HttpClientPolicy {
  defaultSuccessMessage(): string
  isValidCode(code: number | string): boolean
  isValidJsonData(response: any): response is HttpResponse
}
