export {}

declare module 'axios' {
  interface AxiosRequestConfig {
    /**
     * successMessage
     * @description 请求成功时弹出自定义消息，为true时使用内置提示，默认false不弹出消息
     */
    successMessage?: boolean | string
    /**
     * unwrapResponse
     * @description 是否解包JSON响应.data至AxiosResponse.data中，默认为true
     */
    unwrapResponse?: boolean
  }
}
