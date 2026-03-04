export interface ConfirmOptions {
  closable?: boolean
  content: string
  title?: string
  type?: 'danger' | 'default' | 'info' | 'success' | 'warning'
}

export interface MessageCloser {
  close(): void
}

export interface MessageOptions {
  closable?: boolean
  duration?: number
}

export interface IMessageService {
  confirm(options: ConfirmOptions): Promise<[boolean, MessageConfirmBehavior]>
  error(content: string, options?: MessageOptions): Promise<MessageCloser>
  info(content: string, options?: MessageOptions): Promise<MessageCloser>
  loading(content: string, options?: MessageOptions): Promise<MessageCloser>
  question(content: string, options?: MessageOptions): Promise<MessageCloser>
  success(content: string, options?: MessageOptions): Promise<MessageCloser>
  warning(content: string, options?: MessageOptions): Promise<MessageCloser>
}

type MessageConfirmBehavior = 'cancel' | 'close' | 'confirm'
