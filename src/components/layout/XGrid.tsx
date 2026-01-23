import { defineComponent } from 'vue'

interface XColProps {
  lg: number
  md: number
  sm: number
  span: number
  width: number
  xl: number
  xs: number
}

interface XGridProps {
  gap: number
}

export const xGrid = defineComponent(
  (props: XGridProps, { attrs, slots }) => {
    return () => {
      const className = ['x-grid', 'flex', 'flex-wrap']
      const gap = `${props.gap * 0.25}rem`

      return (
        <div
          class={className}
          style={{ columnGap: gap, rowGap: gap }}
          {...attrs}
        >
          {slots?.default?.()}
        </div>
      )
    }
  },
  { props: ['gap'] },
)
