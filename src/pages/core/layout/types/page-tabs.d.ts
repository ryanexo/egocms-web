import type { PopupVisibleChangeContext, TdDropdownProps } from 'tdesign-vue-next'
import type { DefineSetupFnComponent } from 'vue'

import type { Page } from '@/stores/types/page'

export type ContextmenuAction =
  | 'close'
  | 'closeAfter'
  | 'closeBefore'
  | 'closeOther'
  | 'pin'
  | 'refresh'
  | 'unpin'

export interface TabActionMenuProps {
  data: Page
  dataIndex: number
  disabled?: (data: ContextmenuAction) => boolean
  onClose?: (data: Page) => void
  onCloseAfter?: (data: Page) => void
  onCloseBefore?: (data: Page) => void
  onCloseOther?: (data: Page) => void
  onContextmenuVisibleChange?: (visible: boolean, context: PopupVisibleChangeContext) => void
  onPin?: (data: Page) => void
  onRefresh?: (data: Page) => void
  onUnpin?: (data: Page) => void
  trigger?: TdDropdownProps['trigger']
}

export type TabItemProps = Pick<TabActionMenuProps, 'data' | 'dataIndex'>

export interface TabDropdownAction {
  icon: DefineSetupFnComponent<any>
  label: string
  onClick: () => void
}
