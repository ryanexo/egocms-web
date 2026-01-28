import type { AxiosRequestConfig } from 'axios'

export interface HttpClientPolicies {
  authorizer: HttpClientAuthorizer
  notifier: HttpClientNotifier
  validator: HttpClientValidator
}

export interface HttpClientAuthorizer {
  reauthorize(): Promise<boolean>
  token(): string
}

export interface HttpClientValidator {
  isValidCode(code: number | string): boolean
  isValidJsonData(response: unknown): response is HttpResponse
}

export interface HttpClientNotifier {
  sendSuccessMessage(message: AxiosRequestConfig['successMessage']): void
}
