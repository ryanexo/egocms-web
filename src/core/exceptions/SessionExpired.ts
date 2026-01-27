import { AppException } from '@/core/exceptions/AppException.ts'

export class SessionExpiredException<T> extends AppException<T> {}
