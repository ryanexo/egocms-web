import axios from 'axios'

import type { HttpClientConfig } from '@/core/http-client/types/http-client'

import { useHttpClientPolicy } from '@/core/http-client/adapter/http-client-policy.adapter.ts'
import {
  useCredentialInterceptor,
  useCustomConfigInterceptor,
} from '@/core/http-client/interceptor.ts'
import { useStandardResponseTransformer } from '@/core/http-client/transformer.ts'

function createHttpClient(config: HttpClientConfig) {
  const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 1000 * 10,
    transformResponse: [useStandardResponseTransformer(config.policy)],
  })

  useCredentialInterceptor(httpClient)
  useCustomConfigInterceptor(httpClient)

  return httpClient
}

export const httpClient = createHttpClient({
  policy: useHttpClientPolicy(),
})
