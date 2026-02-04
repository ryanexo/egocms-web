import type {
  FormProps,
  OptionProps,
  RadioGroupProps,
  SelectOptionGroup,
  ValidateResultContext,
} from 'tdesign-vue-next'
import type { TdRadioProps } from 'tdesign-vue-next/es/radio/type'
import type { DefineComponent, DefineSetupFnComponent, PropType, VNode } from 'vue'

import { isEmpty } from 'es-toolkit/compat'
import {
  DatePicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  Option,
  OptionGroup,
  Radio,
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
import { computed, defineComponent, h, inject, provide, reactive, ref, toRefs, unref } from 'vue'

import type {
  SchemaFormProps,
  SchemaSubProps,
  SchemaType,
  SelectSubProps,
} from '@/components/form/types/schema-form'
import type { GridLayoutResponsive } from '@/components/layout/types/grid-layout'

import { GridCol, GridLayout } from '@/components/layout/GridLayout.tsx'

const contextKey = Symbol('SchemaFormContext')

const SchemaForm = defineComponent({
  emits: ['reset', 'submit', 'validate'],
  name: 'SchemaForm',
  props: {
    colon: {
      default: false,
      type: Boolean as PropType<FormProps['colon']>,
    },
    data: {
      default: () => Object.create(null),
      type: Object as PropType<FormProps['data']>,
    },
    disabled: Boolean as PropType<FormProps['disabled']>,
    errorMessage: Object as PropType<FormProps['errorMessage']>,
    id: String as PropType<FormProps['id']>,
    labelAlign: {
      default: 'right',
      type: String as PropType<FormProps['labelAlign']>,
    },
    labelWidth: {
      default: '100px',
      type: [String, Number] as PropType<FormProps['labelWidth']>,
    },
    layout: {
      default: 'vertical',
      type: String as PropType<FormProps['layout']>,
    },
    options: {
      required: true,
      type: Array as PropType<SchemaSubProps[]>,
    },
    preventSubmitDefault: {
      default: true,
      type: Boolean as PropType<FormProps['preventSubmitDefault']>,
    },
    readonly: Boolean as PropType<FormProps['readonly']>,
    requiredMark: {
      default: true,
      type: Boolean as PropType<FormProps['requiredMark']>,
    },
    requiredMarkPosition: {
      default: 'left',
      type: String as PropType<FormProps['requiredMarkPosition']>,
    },
    resetType: {
      default: 'empty',
      type: String as PropType<FormProps['resetType']>,
    },
    responsive: Object as PropType<GridLayoutResponsive>,
    scrollToFirstError: String as PropType<FormProps['scrollToFirstError']>,
    showErrorMessage: {
      default: true,
      type: Boolean as PropType<FormProps['showErrorMessage']>,
    },
    size: String as PropType<'large' | 'medium' | 'small'>,
    statusIcon: [Boolean, Object] as PropType<FormProps['statusIcon']>,
    submitWithWarningMessage: Boolean as PropType<FormProps['submitWithWarningMessage']>,
  },
  setup(props: SchemaFormProps, { emit, expose, slots }) {
    const options = ref<InstanceType<typeof SchemaField>[]>([])
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
            {...props.options.map((item) => {
              return (
                <SchemaField
                  key={item.fieldKey}
                  ref={options}
                  {...item}
                />
              )
            })}

            {slots?.default?.()}
          </GridLayout>
        </Form>
      )
    }
  },
})

const SchemaField = defineComponent<SchemaSubProps>({
  name: 'SchemaElement',
  props: [
    'children',
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
  setup(props: SchemaSubProps, { slots }) {
    const context = inject(contextKey) as SchemaFormProps
    const components: Record<
      Exclude<SchemaType, 'custom'>,
      DefineComponent | DefineSetupFnComponent<any>
    > = {
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
    }

    return () => {
      const isInvalidLabel = isEmpty(props.label)
      const modelValuePair: Record<string, any> = {
        modelValue: context.data?.[props.fieldKey],
        'onUpdate:modelValue': (value: any) => {
          if (context.data) {
            context.data[props.fieldKey] = value
          }
        },
      }
      const subProps = props.props || {}
      const size = context.size ?? (subProps as Record<string, any>).size
      const fields: VNode[] = []

      switch (props.type) {
        case 'custom': {
          fields.push(h(props.render))
          break
        }

        case 'radio': {
          const retypeProps = subProps as RadioGroupProps
          const options = Array.isArray(props.children) ? props.children : []

          const GroupComp = (
            <RadioGroup
              allowUncheck={retypeProps.allowUncheck}
              defaultValue={retypeProps.defaultValue}
              disabled={retypeProps.disabled}
              name={retypeProps.name}
              onChange={retypeProps.onChange}
              options={retypeProps.options}
              readonly={retypeProps.readonly}
              size={size}
              theme={retypeProps.theme}
              variant={retypeProps.variant}
              {...modelValuePair}
            >
              {...options.map((item) => {
                const itemOpts: TdRadioProps =
                  typeof item === 'object' ? item : { label: item, value: item }

                return (
                  <Radio
                    allowUncheck={itemOpts.allowUncheck}
                    checked={itemOpts.checked}
                    default={itemOpts.default}
                    defaultChecked={itemOpts.defaultChecked}
                    disabled={itemOpts.disabled}
                    label={itemOpts.label}
                    name={itemOpts.name}
                    onChange={itemOpts.onChange}
                    onClick={itemOpts.onClick}
                    readonly={itemOpts.readonly}
                    value={itemOpts.value}
                  >
                    {itemOpts.label}
                  </Radio>
                )
              })}
            </RadioGroup>
          )

          fields.push(GroupComp)
          break
        }

        case 'select': {
          const renderOption = (options: SelectSubProps['children']) => {
            if (!options) {
              return []
            }
            return options.map((option) => {
              const group = option as SelectOptionGroup
              if (Array.isArray(group.children)) {
                return (
                  <OptionGroup
                    divider={group.divider}
                    label={group.label}
                  >
                    {renderOption(group.children)}
                  </OptionGroup>
                )
              }

              const selectOption = option as OptionProps
              return (
                <Option
                  checkAll={selectOption.checkAll}
                  content={selectOption.content}
                  default={selectOption.default}
                  disabled={selectOption.disabled}
                  label={selectOption.label}
                  title={selectOption.title}
                  value={selectOption.value}
                >
                  {selectOption.label}
                </Option>
              )
            })
          }
          const retypeProps = subProps as SelectSubProps['props'] & {}

          fields.push(
            <Select
              autofocus={retypeProps.autofocus}
              autoWidth={retypeProps.autoWidth}
              borderless={retypeProps.borderless}
              clearable={retypeProps.clearable}
              collapsedItems={retypeProps.collapsedItems}
              creatable={retypeProps.creatable}
              defaultInputValue={retypeProps.defaultInputValue}
              defaultPopupVisible={retypeProps.defaultPopupVisible}
              defaultValue={retypeProps.defaultValue}
              disabled={retypeProps.disabled}
              empty={retypeProps.empty}
              filter={retypeProps.filter}
              filterable={retypeProps.filterable}
              inputProps={retypeProps.inputProps}
              inputValue={retypeProps.inputValue}
              keys={retypeProps.keys}
              label={retypeProps.label}
              loading={retypeProps.loading}
              loadingText={retypeProps.loadingText}
              max={retypeProps.max}
              minCollapsedNum={retypeProps.minCollapsedNum}
              multiple={retypeProps.multiple}
              onBlur={retypeProps.onBlur}
              onChange={retypeProps.onChange}
              onClear={retypeProps.onClear}
              onCreate={retypeProps.onCreate}
              onEnter={retypeProps.onEnter}
              onFocus={retypeProps.onFocus}
              onInputChange={retypeProps.onInputChange}
              onPopupVisibleChange={retypeProps.onPopupVisibleChange}
              onRemove={retypeProps.onRemove}
              onSearch={retypeProps.onSearch}
              options={retypeProps.options}
              panelBottomContent={retypeProps.panelBottomContent}
              panelTopContent={retypeProps.panelTopContent}
              placeholder={retypeProps.placeholder}
              popupProps={retypeProps.popupProps}
              popupVisible={retypeProps.popupVisible}
              prefixIcon={retypeProps.prefixIcon}
              readonly={retypeProps.readonly}
              reserveKeyword={retypeProps.reserveKeyword}
              scroll={retypeProps.scroll}
              selectInputProps={retypeProps.selectInputProps}
              showArrow={retypeProps.showArrow}
              size={size}
              status={retypeProps.status}
              suffix={retypeProps.suffix}
              suffixIcon={retypeProps.suffixIcon}
              tagInputProps={retypeProps.tagInputProps}
              tagProps={retypeProps.tagProps}
              tips={retypeProps.tips}
              value={retypeProps.value}
              valueDisplay={retypeProps.valueDisplay}
              valueType={retypeProps.valueType}
            >
              {renderOption(props.children)}
            </Select>,
          )

          break
        }

        default: {
          const FormNode = components[props.type]
          if (FormNode) {
            fields.push(
              <FormNode
                size={size}
                {...props.props}
                modelValue={context.data?.[props.fieldKey]}
                {...modelValuePair}
              >
                {slots}
              </FormNode>,
            )
          }
          break
        }
      }

      return (
        <GridCol>
          <FormItem
            for={props.meta?.for}
            label={props.label}
            labelAlign={props.meta?.labelAlign}
            labelWidth={isInvalidLabel ? 0 : props.meta?.labelWidth}
            name={props.fieldKey}
            requiredMark={props.meta?.requiredMark}
            rules={props.rules}
            showErrorMessage={props.meta?.showErrorMessage}
            status={props.meta?.status}
            statusIcon={props.meta?.statusIcon}
            successBorder={props.meta?.successBorder}
            tips={props.meta?.tips}
          >
            {fields}
          </FormItem>
        </GridCol>
      )
    }
  },
})

export default SchemaForm
