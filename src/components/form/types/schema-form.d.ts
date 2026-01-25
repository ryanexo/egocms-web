import type {
  DatePickerProps,
  FormItemProps,
  FormProps,
  FormRule,
  InputNumberProps,
  InputProps,
  OptionProps,
  RadioGroupProps,
  RadioOption,
  RangeInputProps,
  SelectProps,
  SwitchProps,
  TagInputProps,
  TextareaProps,
  TimePickerProps,
  TreeSelectProps,
  UploadProps,
} from 'tdesign-vue-next'
import type { DefineComponent, VNode } from 'vue'

import type { LayoutProps } from '@/components/form/types/layout'

export type ElementType =
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

interface BaseSchemaElementProps<T extends Record<string, any>, P extends Record<string, any>, E> {
  extra?: E
  fieldKey: keyof T & string
  label?: string
  meta?: Omit<FormItemProps, 'label' | 'rules'>
  props?: P
  rules?: FormRule[]
  slots?: Record<string, DefineComponent | VNode>
  span?: number
  type: ElementType
}

export type DatePickerElementProps<T = any> = BaseSchemaElementProps<T, DatePickerProps, never>
export type InputElementProps<T = any> = BaseSchemaElementProps<T, InputProps, never>
export type InputNumberElementProps<T = any> = BaseSchemaElementProps<T, InputNumberProps, never>
export type RadioElementProps<T = any> = BaseSchemaElementProps<T, RadioGroupProps, RadioOption>
export type RangeInputElementProps<T = any> = BaseSchemaElementProps<T, RangeInputProps, never>
export type SelectElementProps<T = any> = BaseSchemaElementProps<T, SelectProps<T>, OptionProps>
export type SliderElementProps<T = any> = BaseSchemaElementProps<T, SwitchProps, never>
export type SwitchElementProps<T = any> = BaseSchemaElementProps<T, SwitchProps, never>
export type TagInputElementProps<T = any> = BaseSchemaElementProps<T, TagInputProps, never>
export type TextareaElementProps<T = any> = BaseSchemaElementProps<T, TextareaProps, never>
export type TimePickerElementProps<T = any> = BaseSchemaElementProps<T, TimePickerProps, never>
export type TreeSelectElementProps<T = any> = BaseSchemaElementProps<T, TreeSelectProps, never>
export type UploadElementProps<T = any> = BaseSchemaElementProps<T, UploadProps, never>
export type CustomElementProps<T = any> = BaseSchemaElementProps<T, Record<string, any>, never> & {
  render: DefineComponent
}

export type SchemaElementProps<T = any> =
  | CustomElementProps<T>
  | DatePickerElementProps<T>
  | InputElementProps<T>
  | InputNumberElementProps<T>
  | RadioElementProps<T>
  | RangeInputElementProps<T>
  | SelectElementProps<T>
  | SliderElementProps<T>
  | SwitchElementProps<T>
  | TagInputElementProps<T>
  | TextareaElementProps<T>
  | TimePickerElementProps<T>
  | TreeSelectElementProps<T>
  | UploadElementProps<T>

export interface SchemaFormProps<
  T extends Record<string, any> = Record<string, any>,
> extends FormProps<T> {
  collapse?: boolean
  elements: SchemaElementProps<T>[]
  responsive?: Omit<LayoutProps, 'follow'>
  size?: 'large' | 'medium' | 'small'
}
