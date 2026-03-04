import type { INotificationService } from '@/services/types/notification.service'

export function createNotificationService(): INotificationService {
  return {
    success() {
      return Promise.resolve()
    },
  }
}
