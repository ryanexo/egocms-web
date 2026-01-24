import { Skeleton } from 'tdesign-vue-next'
import { defineComponent } from 'vue'

const AsyncComponentSkeleton = defineComponent({
  setup() {
    return () => {
      return (
        <div class="h-full w-full">
          <Skeleton
            animation="flashed"
            loading={true}
            theme="article"
          />
        </div>
      )
    }
  },
})

export { AsyncComponentSkeleton }
