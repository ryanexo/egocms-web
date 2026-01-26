import type {
  DatePickerProps,
  FormItemProps,
  FormProps,
  FormRule,
  InputNumberProps,
  InputProps,
  OptionProps,
  RadioGroupProps,
  RangeInputProps,
  SelectOptionGroup,
  SelectProps,
  SwitchProps,
  TagInputProps,
  TextareaProps,
  TimePickerProps,
  TNode,
  TreeSelectProps,
} from 'tdesign-vue-next'
import type { TdRadioProps } from 'tdesign-vue-next/es/radio/type'
import type { Slots } from 'vue'

import type { GridLayoutProps } from '@/components/layout/types/grid-layout'

export type SchemaType =
  | 'custom'
  | 'date-picker'
  | 'input'
  | 'input-number'
  | 'radio'
  | 'range-input'
  | 'select'
  | 'slider'
  | 'switch'
  | 'tag-input'
  | 'textarea'
  | 'time-picker'
  | 'tree-select'

interface SubProps<
  S_TYPE extends SchemaType,
  DATA extends Record<string, any>,
  S_PROPS extends Record<string, any>,
  CH,
> {
  children?: CH
  fieldKey: keyof DATA & string
  label?: string
  meta?: Omit<FormItemProps, 'label' | 'rules'>
  props?: S_PROPS
  rules?: FormRule[]
  slots?: Slots
  span?: number
  type: S_TYPE
}

export type DatePickerSubProps<T = any> = SubProps<'date-picker', T, DatePickerProps, never>
export type InputSubProps<T = any> = SubProps<'input', T, InputProps, never>
export type InputNumberSubProps<T = any> = SubProps<'input-number', T, InputNumberProps, never>
export type RadioSubProps<T = any> = SubProps<'radio', T, RadioGroupProps, TdRadioProps[]>
export type RangeInputSubProps<T = any> = SubProps<'range-input', T, RangeInputProps, never>
export type SelectSubProps<T = any> = SubProps<
  'select',
  T,
  SelectProps<T>,
  Omit<SelectOptionGroup, 'group'>[] | OptionProps[]
>
export type SliderSubProps<T = any> = SubProps<'slider', T, SwitchProps, never>
export type SwitchSubProps<T = any> = SubProps<'switch', T, SwitchProps, never>
export type TagInputSubProps<T = any> = SubProps<'tag-input', T, TagInputProps, never>
export type TextareaSubProps<T = any> = SubProps<'textarea', T, TextareaProps, never>
export type TimePickerSubProps<T = any> = SubProps<'time-picker', T, TimePickerProps, never>
export type TreeSelectSubProps<T = any> = SubProps<'tree-select', T, TreeSelectProps, never>
export type CustomSubProps<T = any> = SubProps<'custom', T, Record<string, any>, never> & {
  render: TNode
}

export type SchemaSubProps<T = any> =
  | CustomSubProps<T>
  | DatePickerSubProps<T>
  | InputNumberSubProps<T>
  | InputSubProps<T>
  | RadioSubProps<T>
  | RangeInputSubProps<T>
  | SelectSubProps<T>
  | SliderSubProps<T>
  | SwitchSubProps<T>
  | TagInputSubProps<T>
  | TextareaSubProps<T>
  | TimePickerSubProps<T>
  | TreeSelectSubProps<T>

export interface SchemaFormProps<
  T extends Record<string, any> = Record<string, any>,
> extends FormProps<T> {
  collapse?: boolean
  options: SchemaSubProps<T>[]
  responsive?: Omit<GridLayoutProps, 'follow'>
  size?: 'large' | 'medium' | 'small'
}
