import type { AxiosInstance } from 'axios'

import axios from 'axios'

import type { HttpClientPolicies } from '@/core/http-client/types/http-client'

import { useHttpClientDefaultConfig } from '@/core/http-client/adapters/policy.adapter.ts'
import {
  useCredentialInterceptor,
  useCustomConfigInterceptor,
  useRejectionInterceptor,
  useStandardResponseInterceptor,
} from '@/core/http-client/interceptor.ts'

function createHttpClient(policies: HttpClientPolicies): AxiosInstance {
  const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 1000 * 10,
  })

  useCredentialInterceptor(httpClient, policies)
  useCustomConfigInterceptor(httpClient, policies)
  useStandardResponseInterceptor(httpClient, policies)
  useRejectionInterceptor(httpClient, policies)

  return httpClient
}

export const httpClient = createHttpClient(useHttpClientDefaultConfig())
