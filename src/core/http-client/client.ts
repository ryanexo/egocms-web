import type { AxiosInstance } from 'axios'

import axios from 'axios'

import type { HttpClientConfig } from '@/core/http-client/types/http-client'

import { useHttpClientPolicy } from '@/core/http-client/adapter/http-client-policy.adapter.ts'
import {
  useCredentialInterceptor,
  useCustomConfigInterceptor,
} from '@/core/http-client/interceptor.ts'
import { useStandardResponseTransformer } from '@/core/http-client/transformer.ts'

function createHttpClient(config: HttpClientConfig): AxiosInstance {
  const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 1000 * 10,
    transformResponse: [useStandardResponseTransformer(config.policy)],
  })

  useCredentialInterceptor(httpClient, config.policy)
  useCustomConfigInterceptor(httpClient, config.policy)

  return httpClient
}

const httpClient = createHttpClient({
  policy: useHttpClientPolicy(),
})

export { httpClient }
