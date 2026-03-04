import type { AxiosResponse } from 'axios'

import type { HttpClientPolicies } from '@/core/http-client/types/http-client'

import { AppException } from '@/core/errors/exceptions/AppException.ts'

export class HttpResponseException extends AppException<AxiosResponse> {
  protected policies: HttpClientPolicies

  constructor(message: string, policies: HttpClientPolicies, prev?: Error) {
    super(message, prev)
    this.policies = policies
  }

  public getPolicies() {
    return this.policies
  }
}
