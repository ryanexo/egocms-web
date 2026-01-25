import type { SkeletonProps } from 'tdesign-vue-next'
import type { PropType } from 'vue'

import { Skeleton } from 'tdesign-vue-next'
import { defineComponent } from 'vue'

const AsyncComponentSkeleton = defineComponent({
  name: 'AsyncComponentSkeleton',
  props: {
    theme: {
      default: 'article',
      type: String as PropType<SkeletonProps['theme']>,
    },
  },
  setup(props) {
    return () => {
      return (
        <div class="h-full w-full">
          <Skeleton
            animation="flashed"
            loading={true}
            theme={props.theme}
          />
        </div>
      )
    }
  },
})

function useAsyncComponentSkeleton(theme: SkeletonProps['theme'] = 'article') {
  return <AsyncComponentSkeleton theme={theme} />
}

export { useAsyncComponentSkeleton }
