import type { PopupVisibleChangeContext } from 'tdesign-vue-next'
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

export interface TabPanelLabelProps {
  contextmenuMinWidth?: number
  contextmenuVisible?: boolean
  data: Page
  dataIndex: number
  disableActions?: Partial<Record<ContextmenuAction, boolean>>
  onClose?: (data: Page) => void
  onCloseAfter?: (data: Page) => void
  onCloseBefore?: (data: Page) => void
  onCloseOther?: (data: Page) => void
  onContextmenuVisibleChange?: (visible: boolean, context: PopupVisibleChangeContext) => void
  onPin?: (data: Page) => void
  onRefresh?: (data: Page) => void
  onUnpin?: (data: Page) => void
}

export interface TabDropdownAction {
  icon: DefineSetupFnComponent<any>
  label: string
  onClick: () => void
}
