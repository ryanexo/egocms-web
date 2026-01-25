import type { DropdownProps } from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'

import { omit } from 'es-toolkit'
import { Button, Dropdown } from 'tdesign-vue-next'
import { defineComponent, inject, provide, reactive, toRefs } from 'vue'

import type {
  ButtonElementProps,
  ButtonGroupContext,
  ButtonGroupProps,
} from '@/components/button/types/button-group'

const contextKey = Symbol('SchemaButton')

const ButtonElement = defineComponent<ButtonElementProps>({
  name: 'SchemaButtonElement',
  props: {
    block: Boolean as PropType<ButtonElementProps['block']>,
    content: [String, Object] as PropType<ButtonElementProps['content']>,
    default: [String, Object] as PropType<ButtonElementProps['default']>,
    disabled: Boolean as PropType<ButtonElementProps['disabled']>,
    dropdown: [Array, Object] as PropType<ButtonElementProps['dropdown']>,
    dropdownTrigger: [String, Object] as PropType<ButtonElementProps['dropdownTrigger']>,
    form: String as PropType<ButtonElementProps['form']>,
    ghost: Boolean as PropType<ButtonElementProps['ghost']>,
    href: String as PropType<ButtonElementProps['href']>,
    icon: [Object, Function] as PropType<ButtonElementProps['icon']>,
    id: String as PropType<ButtonElementProps['id']>,
    loading: Boolean as PropType<ButtonElementProps['loading']>,
    loadingProps: Object as PropType<ButtonElementProps['loadingProps']>,
    shape: String as PropType<ButtonElementProps['shape']>,
    slots: Object as PropType<ButtonElementProps['slots']>,
    suffix: Object as PropType<ButtonElementProps['suffix']>,
    tag: String as PropType<ButtonElementProps['tag']>,
    text: String as PropType<ButtonElementProps['text']>,
    theme: String as PropType<ButtonElementProps['theme']>,
    type: String as PropType<ButtonElementProps['type']>,
    variant: String as PropType<ButtonElementProps['variant']>,
  },
  setup(props: ButtonElementProps) {
    const context = inject(contextKey) as ButtonGroupContext

    return () => {
      const slots = { ...props.slots, default: () => props.text }
      const buttonProps = omit(props, ['dropdown', 'slots'])
      if (context.disabled !== undefined) {
        buttonProps.disabled = context.disabled
      }
      if (context.loading !== undefined) {
        buttonProps.loading = context.loading
      }

      const result: VNode[] = [
        <Button
          {...buttonProps}
          size={context.size}
        >
          {slots}
        </Button>,
      ]

      if (props.dropdown) {
        const dropdownProps: DropdownProps = Array.isArray(props.dropdown)
          ? { options: props.dropdown }
          : props.dropdown
        const dropdown = <Dropdown {...dropdownProps}>{props.dropdownTrigger}</Dropdown>

        result.push(dropdown)
      }

      return result
    }
  },
})

const ButtonGroup = defineComponent<ButtonGroupProps>({
  name: 'ButtonGroup',
  props: {
    buttons: {
      required: true,
      type: Array as PropType<ButtonGroupProps['buttons']>,
    },
    disabled: Boolean as PropType<ButtonGroupProps['disabled']>,
    gap: {
      default: 2,
      type: Number as PropType<ButtonGroupProps['gap']>,
    },
    loading: Boolean as PropType<ButtonGroupProps['loading']>,
    size: String as PropType<ButtonGroupProps['size']>,
  },
  setup(props: ButtonGroupProps) {
    const { disabled, loading, size } = toRefs(props)
    provide(contextKey, reactive({ disabled, loading, size }))

    return () => {
      const gap = (props.gap ?? 1) * 0.25
      const gapStyle = gap + 'rem'

      return (
        <div
          class="button-group flex"
          style={{ columnGap: gapStyle, rowGap: gapStyle }}
        >
          {...props.buttons.map((buttonProps) => {
            return <ButtonElement {...buttonProps}></ButtonElement>
          })}
        </div>
      )
    }
  },
})

function useButtonGroup() {}

export { ButtonGroup as default, useButtonGroup }
