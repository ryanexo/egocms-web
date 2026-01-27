import type { AxiosRequestConfig } from 'axios'

export interface HttpClientConfig {
  policy: HttpClientPolicy
}

export interface HttpClientPolicy {
  authorizationValue(): string
  isValidCode(code: number | string): boolean
  isValidJsonData(response: any): response is HttpResponse
  sendSuccessMessage(message: AxiosRequestConfig['successMessage']): void
}
