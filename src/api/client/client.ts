import type {
  AxiosResponseTransformer,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios'

import axios from 'axios'

import type { HttpStandardResponse } from '@/api/types/http-client'

import {
  useCredentialInterceptor,
  useCustomConfigInterceptor,
} from '@/api/client/interceptor.ts'

export function createHttpClientDefaultConfig(): CreateAxiosDefaults {
  return {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 1000 * 10,
    transformResponse: [createStandardResponseTransformer()],
  }
}

function createDefaultHttpClient() {
  const httpClient = axios.create(createHttpClientDefaultConfig())

  useCredentialInterceptor(httpClient)
  useCustomConfigInterceptor(httpClient)

  return httpClient
}

function createStandardResponseTransformer(): AxiosResponseTransformer {
  return function (this: InternalAxiosRequestConfig, data, headers) {
    if (this.unwrapResponse !== false) {
      const isJsonResponse =
        this.responseType === 'json' ||
        String(headers['Content-Type'])
          .toLowerCase()
          .includes('application/json')

      if (isJsonResponse && isValidJSONResponse(data)) {
        return data.data
      }
    }

    return data
  }
}

function isValidJSONResponse(response: any): response is HttpStandardResponse {
  if (response === null || typeof response !== 'object') {
    return false
  }

  return Reflect.has(response, 'code') && Reflect.has(response, 'msg')
}

export const httpClient = createDefaultHttpClient()
