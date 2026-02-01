import type { AxiosResponse } from 'axios'

import { AppException } from '@/core/errors/exceptions/AppException.ts'

export class HttpResponseException extends AppException<AxiosResponse> {}
