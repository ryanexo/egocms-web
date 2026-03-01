import { SwapIcon } from 'tdesign-icons-vue-next'
import { defineComponent } from 'vue'

import { useAppStore } from '@/stores'

const AppStatusBar = defineComponent({
  name: 'StatusBar',
  setup() {
    const appStore = useAppStore()

    return () => {
      return (
        <div class="border-b-divider h-(--app-header) border-b bg-white">
          <div
            class="flex-center w-8"
            onClick={() => appStore.toggleSidebarCollapsed()}
          >
            <SwapIcon size="1.25rem" />
          </div>
        </div>
      )
    }
  },
})

export { AppStatusBar as default }
