import { AppException } from '@/core/exceptions/base.ts'

export class HttpRequestException<T> extends AppException<T> {}
