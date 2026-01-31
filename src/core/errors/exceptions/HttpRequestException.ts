import { AppException } from '@/core/errors/exceptions/AppException.ts'

export class HttpRequestException<T> extends AppException<T> {}
