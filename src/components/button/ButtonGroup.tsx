import type { DropdownProps } from 'tdesign-vue-next'
import type { PropType } from 'vue'

import { omit } from 'es-toolkit'
import { Button, Dropdown } from 'tdesign-vue-next'
import { defineComponent, inject, provide, reactive, toRefs } from 'vue'

import type {
  ActionProps,
  ButtonGroupContext,
  ButtonGroupProps,
} from '@/components/button/types/button-group'

const contextKey = Symbol('SchemaButton')

const Action = defineComponent<ActionProps>({
  name: 'SchemaButtonElement',
  props: {
    block: Boolean as PropType<ActionProps['block']>,
    content: [String, Object] as PropType<ActionProps['content']>,
    default: [String, Object] as PropType<ActionProps['default']>,
    disabled: Boolean as PropType<ActionProps['disabled']>,
    dropdown: [Array, Object] as PropType<ActionProps['dropdown']>,
    form: String as PropType<ActionProps['form']>,
    ghost: Boolean as PropType<ActionProps['ghost']>,
    href: String as PropType<ActionProps['href']>,
    icon: [Object, Function] as PropType<ActionProps['icon']>,
    id: String as PropType<ActionProps['id']>,
    loading: Boolean as PropType<ActionProps['loading']>,
    loadingProps: Object as PropType<ActionProps['loadingProps']>,
    shape: String as PropType<ActionProps['shape']>,
    slots: Object as PropType<ActionProps['slots']>,
    suffix: Object as PropType<ActionProps['suffix']>,
    tag: String as PropType<ActionProps['tag']>,
    text: String as PropType<ActionProps['text']>,
    theme: String as PropType<ActionProps['theme']>,
    type: String as PropType<ActionProps['type']>,
    variant: String as PropType<ActionProps['variant']>,
  },
  setup(props: ActionProps) {
    const context = inject(contextKey) as ButtonGroupContext

    return () => {
      const slots = { ...props.slots, default: () => props.text }
      const selfProps: ActionProps & { size?: ButtonGroupProps['size'] } = omit(props, [
        'dropdown',
        'slots',
      ])
      if (context.disabled !== undefined) {
        selfProps.disabled = context.disabled
      }
      if (context.loading !== undefined) {
        selfProps.loading = context.loading
      }
      selfProps.size = context.size

      if (!props.dropdown) {
        return <Button {...selfProps}>{slots}</Button>
      }

      const dropdownProps: DropdownProps = Array.isArray(props.dropdown)
        ? { options: props.dropdown }
        : props.dropdown

      return (
        <Dropdown {...dropdownProps}>
          <Button {...selfProps}>{slots}</Button>
        </Dropdown>
      )
    }
  },
})

const ButtonGroup = defineComponent<ButtonGroupProps>({
  name: 'ButtonGroup',
  props: {
    actions: {
      required: true,
      type: Array as PropType<ButtonGroupProps['actions']>,
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
          {...props.actions.map((actionProps) => {
            return <Action {...actionProps}></Action>
          })}
        </div>
      )
    }
  },
})

function useButtonGroup() {}

export { ButtonGroup as default, useButtonGroup }
