import type { AxiosRequestConfig } from 'axios'

import type { HttpClientPolicies } from '@/core/http-client/types/http-client'

import { AppException } from '@/core/errors/exceptions/AppException.ts'

export class HttpRequestException extends AppException<AxiosRequestConfig> {
  protected policies: HttpClientPolicies

  constructor(message: string, policies: HttpClientPolicies, prev?: Error) {
    super(message, prev)
    this.policies = policies
  }

  public getPolicies() {
    return this.policies
  }
}
