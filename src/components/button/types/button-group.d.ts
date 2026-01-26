import type { ButtonProps, DropdownOption, DropdownProps } from 'tdesign-vue-next'
import type { Slots } from 'vue'

export interface ActionProps extends Omit<ButtonProps, 'size'> {
  dropdown?: DropdownOption[] | DropdownProps
  id: keyof any
  slots?: Slots
  text?: string
}

export interface ButtonGroupProps {
  actions: ActionProps[]
  disabled?: boolean
  gap?: number
  loading?: boolean
  size?: 'large' | 'medium' | 'small'
}

export type ButtonGroupContext = Omit<ButtonGroupProps, 'actions'>
