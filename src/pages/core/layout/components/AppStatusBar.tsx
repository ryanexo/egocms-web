import type { RouteRecordRaw } from 'vue-router'

import { IconFont, SwapIcon } from 'tdesign-icons-vue-next'
import { Breadcrumb, BreadcrumbItem, Button } from 'tdesign-vue-next'
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import { useAppStore, usePageStore, useRouteStore } from '@/stores'

const MenuBreadcrumb = defineComponent({
  name: 'MenuBreadcrumb',
  setup() {
    const router = useRouter()
    const pageStore = usePageStore()
    const routeStore = useRouteStore()
    const ancestors = computed<RouteRecordRaw[]>(() => {
      const result = routeStore.findAncestor(pageStore.current)
      const current = routeStore.routeMap.get(pageStore.current)
      if (current) {
        result.push(current)
      }
      return result
    })

    const onClick = (data: RouteRecordRaw) => {
      if (data.name) {
        router.push({ name: data.name })
      }
    }

    return () => {
      const items = ancestors.value

      return (
        <Breadcrumb>
          {items.map((item) => {
            return (
              <BreadcrumbItem onClick={() => onClick(item)}>
                {{
                  default: () => item.meta?.title,
                  icon: () =>
                    item.meta?.icon ? <IconFont name={item.meta?.icon}></IconFont> : null,
                }}
              </BreadcrumbItem>
            )
          })}
        </Breadcrumb>
      )
    }
  },
})

const AppStatusBar = defineComponent({
  name: 'StatusBar',
  setup() {
    const appStore = useAppStore()

    return () => {
      return (
        <div class="border-b-divider flex h-(--app-status-bar-height) items-center gap-x-2 border-b bg-white px-2">
          <div
            class="flex-center w-8"
            onClick={() => appStore.toggleSidebarCollapsed()}
          >
            <Button variant="text">
              <SwapIcon />
            </Button>
          </div>
          <MenuBreadcrumb />
        </div>
      )
    }
  },
})

export { AppStatusBar as default }
