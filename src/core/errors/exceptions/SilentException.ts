import { AppException } from '@/core/errors/exceptions/AppException.ts'

export class SilentException<T> extends AppException<T> {
  constructor(context: T) {
    super('silent error')
    this.withContext(context)
  }
}
