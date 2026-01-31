import { AppException } from '@/core/errors/exceptions/AppException.ts'

export class SessionExpiredException<T> extends AppException<T> {}
