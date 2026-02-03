import type { PropType, VNode } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import { Icon, MenuItem, Submenu } from 'tdesign-vue-next'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import type { MenuProps } from '@/pages/core/layout/types/menu'

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

        if (isLeaf) {
          result.push(
            <MenuItem
              content={meta.title}
              href={meta.externalUrl}
              router={meta.externalUrl ? undefined : router}
              routerLink={!meta.externalUrl}
              target={meta.externalUrl ? '_blank' : undefined}
              to={{ path: menu.path, query: meta.query }}
              value={uniqueName}
            >
              {{
                icon: () => (meta.icon ? <Icon name={meta.icon} /> : undefined),
              }}
            </MenuItem>,
          )
        } else {
          result.push(
            <Submenu
              title={meta.title}
              value={uniqueName}
            >
              {{
                default: () => <NestedMenuItem menus={children}></NestedMenuItem>,
                icon: () => (meta.icon ? <Icon name={meta.icon} /> : undefined),
              }}
            </Submenu>,
          )
        }
      })

      return result
    }
  },
})

export { NestedMenuItem as default }
