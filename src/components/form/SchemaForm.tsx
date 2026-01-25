import type { FormProps, ValidateResultContext } from 'tdesign-vue-next'
import type { DefineComponent, PropType } from 'vue'

import { isEmpty } from 'es-toolkit/compat'
import {
  DatePicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  RadioGroup,
  RangeInput,
  Select,
  Slider,
  Switch,
  TagInput,
  Textarea,
  TimePicker,
  TreeSelect,
} from 'tdesign-vue-next'
import { computed, defineComponent, inject, provide, reactive, ref, toRefs, unref } from 'vue'

import type { LayoutProps } from '@/components/form/types/layout'
import type {
  CustomElementProps,
  ElementType,
  SchemaElementProps,
  SchemaFormProps,
} from '@/components/form/types/schema-form'

import { GridCol, GridLayout } from '@/components/form/LayoutContainer.tsx'

const contextKey = Symbol('SchemaFormContext')

const SchemaForm = defineComponent({
  emits: ['reset', 'submit', 'validate'],
  name: 'SchemaForm',
  props: {
    colon: Boolean as PropType<FormProps['colon']>,
    data: Object as PropType<FormProps['data']>,
    disabled: Boolean as PropType<FormProps['disabled']>,
    elements: Array as PropType<SchemaElementProps[]>,
    errorMessage: Object as PropType<FormProps['errorMessage']>,
    id: String as PropType<FormProps['id']>,
    labelAlign: String as PropType<FormProps['labelAlign']>,
    labelWidth: [String, Number] as PropType<FormProps['labelWidth']>,
    layout: String as PropType<FormProps['layout']>,
    preventSubmitDefault: Boolean as PropType<FormProps['preventSubmitDefault']>,
    readonly: Boolean as PropType<FormProps['readonly']>,
    requiredMark: Boolean as PropType<FormProps['requiredMark']>,
    requiredMarkPosition: String as PropType<FormProps['requiredMarkPosition']>,
    resetType: String as PropType<FormProps['resetType']>,
    responsive: Object as PropType<Omit<LayoutProps, 'follow'>>,
    scrollToFirstError: String as PropType<FormProps['scrollToFirstError']>,
    showErrorMessage: Boolean as PropType<FormProps['showErrorMessage']>,
    size: String as PropType<'default' | 'large' | 'small'>,
    statusIcon: [Boolean, Object] as PropType<FormProps['statusIcon']>,
    submitWithWarningMessage: Boolean as PropType<FormProps['submitWithWarningMessage']>,
  },
  setup(props: SchemaFormProps, { emit, expose }) {
    const elements = ref<InstanceType<typeof SchemaElement>[]>([])
    const form = ref<InstanceType<typeof Form>>()
    const responsive = computed<SchemaFormProps['responsive'] & {}>(() => {
      return {
        gap: props.responsive?.gap ?? 6,
        lg: props.responsive?.lg ?? 8,
        md: props.responsive?.md ?? 12,
        sm: props.responsive?.sm ?? 24,
        xl: props.responsive?.xl ?? 6,
        xs: props.responsive?.xs ?? 24,
      }
    })

    provide(contextKey, reactive({ ...toRefs(props) }))
    expose({ form })

    return () => {
      return (
        <Form
          colon={props.colon}
          data={props.data}
          disabled={props.disabled}
          errorMessage={props.errorMessage}
          id={props.id}
          labelAlign={props.labelAlign}
          labelWidth={props.labelWidth}
          layout={props.layout}
          onReset={(context: { e?: Event }) => emit('reset', context)}
          onSubmit={(context: { e?: Event }) => emit('submit', context)}
          onValidate={(result: ValidateResultContext<any>) => emit('validate', result)}
          preventSubmitDefault={props.preventSubmitDefault}
          readonly={props.readonly}
          ref={form}
          requiredMark={props.requiredMark}
          requiredMarkPosition={props.requiredMarkPosition}
          resetType={props.resetType}
          rules={props.rules}
          scrollToFirstError={props.scrollToFirstError}
          showErrorMessage={props.showErrorMessage}
          statusIcon={props.statusIcon}
          submitWithWarningMessage={props.submitWithWarningMessage}
        >
          <GridLayout
            follow={form?.value?.$el?.parentElement}
            gap={unref(responsive).gap}
            lg={unref(responsive).lg}
            md={unref(responsive).md}
            sm={unref(responsive).sm}
            xl={unref(responsive).xl}
            xs={unref(responsive).xs}
          >
            {...props.elements.map((item) => {
              return (
                <SchemaElement
                  ref={elements}
                  {...item}
                />
              )
            })}
          </GridLayout>
        </Form>
      )
    }
  },
})

const SchemaElement = defineComponent<SchemaElementProps>({
  name: 'SchemaElement',
  props: [
    'extra',
    'fieldKey',
    'label',
    'props',
    'slots',
    'span',
    'type',
    'render',
    'meta',
    'rules',
  ],
  setup(props: SchemaElementProps, { slots }) {
    const context = inject(contextKey) as SchemaFormProps
    const components = {
      'date-picker': DatePicker,
      input: Input,
      'input-number': InputNumber,
      radio: RadioGroup,
      'range-input': RangeInput,
      select: Select,
      slider: Slider,
      switch: Switch,
      'tag-input': TagInput,
      textarea: Textarea,
      'time-picker': TimePicker,
      'tree-select': TreeSelect,
    } as Record<Exclude<ElementType, 'custom'>, DefineComponent<any, any, any>>

    const updateModelValue = (value: any) => {
      if (context.data) {
        context.data[props.fieldKey] = value
      }
    }

    return () => {
      const isInvalidLabel = isEmpty(props.label)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const size = context.size ?? props.props?.size

      if (props.type === 'select') {
        return <div></div>
      }

      if (props.type === 'radio') {
        return <div></div>
      }

      const FormItemElement =
        props.type === 'custom' ? (props as CustomElementProps).render : components[props.type]

      return (
        <GridCol>
          <FormItem
            for={props.meta?.for}
            label={props.label}
            labelAlign={props.meta?.labelAlign}
            labelWidth={isInvalidLabel ? 0 : props.meta?.labelWidth}
            name={props.meta?.name}
            requiredMark={props.meta?.requiredMark}
            rules={props.rules}
            showErrorMessage={props.meta?.showErrorMessage}
            status={props.meta?.status}
            statusIcon={props.meta?.statusIcon}
            successBorder={props.meta?.successBorder}
            tips={props.meta?.tips}
          >
            <FormItemElement
              size={size}
              {...props.props}
              modelValue={context.data?.[props.fieldKey]}
              onUpdate:modelValue={updateModelValue}
              v-slots={slots}
            />
          </FormItem>
        </GridCol>
      )
    }
  },
})

export default SchemaForm
