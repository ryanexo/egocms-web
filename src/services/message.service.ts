import { MessagePlugin } from 'tdesign-vue-next'

import type { MessageService } from '@/services/types/message.service'

import { openConfirmDialog } from '@/components/message/ConfirmDialog.tsx'

export function useMessageService(): MessageService {
  const confirm: MessageService['confirm'] = async (options) => {
    const result = await openConfirmDialog(options.content, {
      title: options.title,
      type: options.type || 'default',
    })
    return [result === 'confirm', result]
  }
  const success: MessageService['success'] = (content, options) => {
    return MessagePlugin.success({
      closeBtn: options?.closable,
      content,
      duration: options?.duration,
    })
  }
  const error: MessageService['error'] = (content, options) => {
    return MessagePlugin.error({
      closeBtn: options?.closable,
      content,
      duration: options?.duration,
    })
  }
  const info: MessageService['info'] = (content, options) => {
    return MessagePlugin.info({
      closeBtn: options?.closable,
      content,
      duration: options?.duration,
    })
  }
  const loading: MessageService['loading'] = (content, options) => {
    return MessagePlugin.loading({
      closeBtn: options?.closable,
      content,
      duration: options?.duration,
    })
  }
  const question: MessageService['question'] = (content, options) => {
    return MessagePlugin.question({
      closeBtn: options?.closable,
      content,
      duration: options?.duration,
    })
  }
  const warning: MessageService['warning'] = (content, options) => {
    return MessagePlugin.warning({
      closeBtn: options?.closable,
      content,
      duration: options?.duration,
    })
  }

  return { confirm, error, info, loading, question, success, warning }
}

export const messageService = useMessageService()
