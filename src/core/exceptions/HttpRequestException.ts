import { AppException } from '@/core/exceptions/AppException.ts'

export class HttpRequestException<T> extends AppException<T> {}
