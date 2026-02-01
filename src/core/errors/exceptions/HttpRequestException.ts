import type { AxiosRequestConfig } from 'axios'

import { AppException } from '@/core/errors/exceptions/AppException.ts'

export class HttpRequestException extends AppException<AxiosRequestConfig> {}
