import { useElementSize } from '@vueuse/core'
import { computed, defineComponent, inject, provide, reactive, ref, toRefs } from 'vue'

interface BlockProps {
  lg: number
  md: number
  sm: number
  span: number
  width: number
  xl: number
  xs: number
}

interface LayoutProps extends Omit<BlockProps, 'span' | 'width'> {
  follow?: HTMLElement
  gap: number
}

const contextKey = Symbol()

const Layout = defineComponent(
  (props: LayoutProps, { attrs, slots }) => {
    return () => {
      const el = ref<HTMLElement>()
      const className = ['x-grid', 'flex', 'flex-wrap']
      const gap = `${props.gap * 0.25}rem`

      provide(contextKey, reactive(toRefs(props)))

      return (
        <div
          class={className}
          ref={el}
          style={{ columnGap: gap, rowGap: gap }}
          {...attrs}
        >
          {slots?.default?.()}
        </div>
      )
    }
  },
  { props: ['gap', 'lg', 'md', 'sm', 'xs', 'xl'] },
)

const LayoutBlock = defineComponent(
  (props: BlockProps, { attrs, expose, slots }) => {
    const ctx = inject<LayoutProps>(contextKey)
    const followElement = computed(() => ctx?.follow || document.body)
    const { width } = useElementSize(followElement, {
      height: document.body.offsetHeight,
      width: document.body.offsetWidth,
    })

    expose({ width })

    return () => {
      return <div></div>
    }
  },
  {
    props: ['lg', 'md', 'sm', 'xs', 'xl', 'width', 'span'],
  },
)

function size2layoutCode(): keyof Omit<BlockProps, 'span' | 'width'> {
  return 'md'
}
