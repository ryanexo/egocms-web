import type { ButtonProps, DropdownOption, DropdownProps } from 'tdesign-vue-next'
import type { DefineComponent, Slots, VNode } from 'vue'

export interface ButtonElementProps extends Omit<ButtonProps, 'size'> {
  dropdown?: DropdownOption[] | DropdownProps
  dropdownTrigger?: DefineComponent | string | VNode
  id: keyof any
  slots?: Slots
  text?: string
}

export interface ButtonGroupProps {
  buttons: ButtonElementProps[]
  disabled?: boolean
  gap?: number
  loading?: boolean
  size?: 'large' | 'medium' | 'small'
}

export type ButtonGroupContext = Omit<ButtonGroupProps, 'buttons'>
