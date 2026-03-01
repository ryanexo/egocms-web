import type { MenuValue } from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import { Icon, Menu, MenuItem, Submenu } from 'tdesign-vue-next'
import { computed, defineComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { MenuProps } from '@/pages/core/layout/types/menu'

import { useAppStore, useRouterStore } from '@/stores'
import { useClassNs } from '@/utils/bem.ts'

import '../styles/app-menu.css'

const AppMenuItem = defineComponent<MenuProps>({
  name: 'AppMenuItem',
  props: {
    menus: {
      required: true,
      type: Array as PropType<RouteRecordRaw[]>,
    },
  },
  setup(props: MenuProps) {
    const ns = useClassNs('app-menu')
    const router = useRouter()

    return () => {
      const result: VNode[] = []

      props.menus.forEach((menu) => {
        const { children, meta, name, path } = menu
        if (!meta || meta.hiddenInMenu) {
          return
        }

        const isLeaf = !Array.isArray(children) || children.length === 0
        const uniqueName = name ? String(name) : path

        const icon = () => {
          const menuIcon = meta.icon ? <Icon name={meta.icon} /> : <></>

          return <span class={ns.e('icon')}>{menuIcon}</span>
        }

        if (isLeaf) {
          result.push(
            <MenuItem
              content={meta.title}
              href={meta.externalUrl}
              key={uniqueName}
              router={meta.externalUrl ? undefined : router}
              routerLink={!meta.externalUrl}
              target={meta.externalUrl ? '_blank' : undefined}
              to={{ path: menu.path, query: meta.query }}
              value={uniqueName}
            >
              {{
                icon,
              }}
            </MenuItem>,
          )
        } else {
          result.push(
            <Submenu
              key={uniqueName}
              title={meta.title}
              value={uniqueName}
            >
              {{
                default: () => <AppMenuItem menus={children} />,
                icon,
              }}
            </Submenu>,
          )
        }
      })

      return result
    }
  },
})

const AppMenu = defineComponent({
  name: 'AppMenu',
  setup(_, { expose }) {
    const route = useRoute()
    const appStore = useAppStore()
    const routerStore = useRouterStore()
    const activeMenu = computed(() => String(route.name))
    const expanded = ref<string[]>([])
    const ns = useClassNs('app-menu')

    const onUpdateExpanded = (value: MenuValue[]) => {
      expanded.value = value as string[]
    }

    watch(
      () => route.name,
      (name) => {
        expanded.value = routerStore.findAncestor(String(name)).map((item) => item.name as string)
      },
      { flush: 'sync', immediate: true },
    )
    expose({ activeMenu, expanded })

    return () => {
      return (
        <Menu
          class={ns.b()}
          collapsed={appStore.sidebarCollapsed}
          expanded={expanded.value}
          expandMutex={true}
          onExpand={onUpdateExpanded}
          value={activeMenu.value}
          width={appStore.sidebarCollapsed ? 'calc(var(--spacing) * 20)' : 'var(--app-sidebar)'}
        >
          <AppMenuItem menus={routerStore.routes} />
        </Menu>
      )
    }
  },
})

export { AppMenu as default }
