import type { MenuValue } from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import { Icon, Menu, MenuItem, Submenu } from 'tdesign-vue-next'
import { computed, defineComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { MenuProps } from '@/pages/core/layout/types/menu'

import { useRouterStore } from '@/stores'

import styles from '../styles/nested-menu.module.css'

const NestedMenuItem = defineComponent<MenuProps>({
  name: 'NestedMenuItem',
  props: {
    menus: {
      required: true,
      type: Array as PropType<RouteRecordRaw[]>,
    },
  },
  setup(props: MenuProps) {
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

          return (
            <span
              class={[
                styles.nestedMenuItemIcon,
                'inline-flex',
                'h-6',
                'w-6',
                'items-center',
                'justify-center',
                'text-xs',
              ]}
            >
              {menuIcon}
            </span>
          )
        }

        if (isLeaf) {
          result.push(
            <MenuItem
              class={[styles.nestedMenuItem]}
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
                default: () => (
                  <NestedMenuItem
                    class={[styles.nestedMenuItem]}
                    menus={children}
                  />
                ),
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

const NestedMenu = defineComponent({
  name: 'NestedMenu',
  setup() {
    const route = useRoute()
    const routerStore = useRouterStore()

    const activeMenu = computed(() => String(route.name))
    const expanded = ref<string[]>([])

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

    return () => {
      return (
        <Menu
          class={[styles.nestedMenu, 'bg-menu-bg!', 'w-full!']}
          expanded={expanded.value}
          expandMutex={true}
          onExpand={onUpdateExpanded}
          value={activeMenu.value}
        >
          <NestedMenuItem menus={routerStore.routes} />
        </Menu>
      )
    }
  },
})

export { NestedMenu as default }
