import { MessagePlugin } from 'tdesign-vue-next'

import type { MessageService } from '@/core/services/types/message.service'

import { openConfirmDialog } from '@/components/dialog/ConfirmDialog.tsx'

const messageService: MessageService = {
  confirm: async (options) => {
    const result = await openConfirmDialog(options.content, {
      title: options.title,
      type: options.type || 'default',
    }).result
    return [result === 'confirm', result]
  },
  error: (content, options) => {
    return MessagePlugin.error({
      closeBtn: options?.closable,
      content,
      duration: options?.duration,
    })
  },
  info: (content, options) => {
    return MessagePlugin.info({
      closeBtn: options?.closable,
      content,
      duration: options?.duration,
    })
  },
  loading: (content, options) => {
    return MessagePlugin.loading({
      closeBtn: options?.closable,
      content,
      duration: options?.duration,
    })
  },
  question: (content, options) => {
    return MessagePlugin.question({
      closeBtn: options?.closable,
      content,
      duration: options?.duration,
    })
  },
  success: (content, options) => {
    return MessagePlugin.success({
      closeBtn: options?.closable,
      content,
      duration: options?.duration,
    })
  },
  warning: (content, options) => {
    return MessagePlugin.warning({
      closeBtn: options?.closable,
      content,
      duration: options?.duration,
    })
  },
}

export { messageService }
