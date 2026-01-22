export {}

declare module 'axios' {
  interface AxiosRequestConfig {
    /**
     * successMessage 请求成功时弹出自定义消息，为true时使用内置提示，默认false不弹出消息
     */
    successMessage?: boolean | string
    /**
     * unwrapResponse 是否解包响应结果data至AxiosResponse.data中，默认为true
     */
    unwrapResponse?: boolean
  }
}

export interface HttpStandardResponse<T = any> {
  code: string
  data?: T
  msg: string
}
