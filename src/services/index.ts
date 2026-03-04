import { createNotificationService } from '@/services/modules/notification.service.ts'
import { createProgressService } from '@/services/modules/progress.service.ts'

import { createMessageService } from './modules/message.service.ts'

export { useAccountService } from './modules/account.service.ts'
export { useAuthService, useAuthServiceWithRouter } from './modules/auth.service.ts'
export { usePageService } from './modules/page.service.ts'

export const notificationService = createNotificationService()
export const messageService = createMessageService()
export const progressService = createProgressService({
  speed: 500,
  trickle: true,
  trickleSpeed: 200,
})
