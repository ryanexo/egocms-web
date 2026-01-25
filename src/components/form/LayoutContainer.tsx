import { useResizeObserver } from '@vueuse/core'
import {
  computed,
  defineComponent,
  inject,
  onWatcherCleanup,
  provide,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue'

import type { ColProps, LayoutData, LayoutProps } from './types/layout'

const contextKey = Symbol('GridLayoutContext')

const GridLayout = defineComponent<LayoutProps>({
  name: 'GridLayout',
  props: ['gap', 'lg', 'md', 'sm', 'xs', 'xl', 'follow'],
  setup(props: LayoutProps, { attrs, slots }) {
    const gap = computed(() => `${(props.gap ?? 1) * 0.25}rem`)
    provide(contextKey, reactive({ ...toRefs(props), gap }))

    return () => {
      return (
        <div
          class="flex flex-wrap"
          style={{ '--layout-gap': gap.value, rowGap: gap.value }}
          {...attrs}
        >
          {slots?.default?.()}
        </div>
      )
    }
  },
})

const GridCol = defineComponent<ColProps>({
  name: 'GridCol',
  props: ['lg', 'md', 'sm', 'xs', 'xl', 'col', 'span'],
  setup(props: ColProps, { attrs, expose, slots }) {
    const ctx = inject<LayoutProps>(contextKey)
    const container = computed(() => ctx?.follow ?? document.body)
    const containerWidth = ref(document.body.offsetWidth)
    const mergedOptions = computed<Required<ColProps>>(() => {
      const result: Required<ColProps> = {
        col: 6,
        lg: 6,
        md: 6,
        sm: 6,
        span: 1,
        xl: 6,
        xs: 6,
      }
      Object.keys(result).forEach((item) => {
        const key = item as keyof ColProps
        const ctxValue = Reflect.get(ctx || {}, key)
        if (ctxValue !== undefined) {
          result[key] = ctxValue
        } else if (props[key] !== undefined) {
          result[key] = props[key]
        }
      })
      return result
    })
    const layout = computed(() => getCurrentLayout(containerWidth.value, mergedOptions.value))
    const cols = computed(() => Math.min(layout.value.cols * mergedOptions.value.span, 24))

    watch(
      container,
      (el) => {
        const { stop } = useResizeObserver(el, (entries) => {
          const target = entries?.[0]
          if (target) {
            containerWidth.value = target.contentRect.width
          }
        })

        onWatcherCleanup(stop)
      },
      { flush: 'sync', immediate: true },
    )

    expose({ cols, layout })

    return () => {
      const baseWidth = 100 / 24
      const colWidth = (baseWidth * cols.value).toFixed(6) + '%'

      return (
        <div
          {...attrs}
          style={{
            paddingLeft: 'var(--layout-gap)',
            paddingRight: 'var(--layout-gap)',
            width: colWidth,
          }}
        >
          {slots?.default?.()}
        </div>
      )
    }
  },
})

function getCurrentLayout(width: number, layout: LayoutProps): LayoutData {
  if (width >= 1920 && layout.xl) {
    return { cols: layout.xl, layout: 'xl' }
  }
  if (width >= 1280 && layout.lg) {
    return { cols: layout.lg, layout: 'lg' }
  }
  if (width >= 768 && layout.md) {
    return { cols: layout.md, layout: 'md' }
  }
  if (width >= 540 && layout.sm) {
    return { cols: layout.sm, layout: 'sm' }
  }
  return { cols: layout.xs ?? 1, layout: 'xs' }
}

export { getCurrentLayout, GridCol, GridLayout }
