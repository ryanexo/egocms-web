import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

import { httpClient } from '@/core/http-client/client.ts'

export interface Query<T, R> {
  (httpClient: AxiosInstance, data: T, config: AxiosRequestConfig): Promise<AxiosResponse<R>>
}

export interface QueryResult<T> {
  abort(): void
  result: Promise<T>
  signal: AbortSignal
}

function createQueryDefinition<T, R>(
  httpClient: AxiosInstance,
  query: Query<T, R>,
  defaultConfig?: AxiosRequestConfig,
  data?: T,
  config?: AxiosRequestConfig,
): QueryResult<R> {
  const controller = new AbortController()
  const { signal } = controller
  const abort = () => controller.abort()

  const request = query(httpClient, data ?? ({} as T), { ...defaultConfig, ...config, signal })
  const result = request.then(({ data }) => data)

  return { abort, result, signal }
}

function defineQuery<T, R = any>(query: Query<T, R>, defaultConfig?: AxiosRequestConfig) {
  return (data: T, config?: AxiosRequestConfig): QueryResult<R> => {
    return createQueryDefinition<T, R>(httpClient, query, defaultConfig, data, config)
  }
}

function defineQueryNoData<R = any>(query: Query<never, R>, defaultConfig?: AxiosRequestConfig) {
  return (config?: AxiosRequestConfig) => {
    return createQueryDefinition<never, R>(httpClient, query, defaultConfig, undefined, config)
  }
}

export { defineQuery, defineQueryNoData }
