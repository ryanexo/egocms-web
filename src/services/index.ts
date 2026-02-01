import { createAccountService } from '@/services/modules/account.service.ts'
import { createPageService } from '@/services/modules/page.service.ts'

import { createAuthService } from './modules/auth.service.ts'
import { createMessageService } from './modules/message.service.ts'

export const messageService = createMessageService()
export const authService = createAuthService()
export const accountService = createAccountService()
export const pageService = createPageService()
