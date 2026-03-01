import type { TabsDragSortContext, TabValue } from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'

import {
  ChevronDownIcon,
  ChevronLeftDoubleIcon,
  ChevronRightDoubleIcon,
  CloseIcon,
  ExpandHorizontalIcon,
  LockCheckedIcon,
  LockOffIcon,
  PinIcon,
  RefreshIcon,
} from 'tdesign-icons-vue-next'
import { Dropdown, DropdownItem, DropdownMenu, Icon, TabPanel, Tabs } from 'tdesign-vue-next'
import { computed, defineComponent, watch } from 'vue'
import { useRouter } from 'vue-router'

import type {
  ContextmenuAction,
  TabActionMenuProps,
  TabDropdownAction,
  TabItemProps,
} from '@/pages/core/layout/types/page-tabs'
import type { Page } from '@/stores/types/page'

import { trans } from '@/locales'
import { usePageService } from '@/services'
import { usePageStore, useRouterStore } from '@/stores'
import { useClassNs } from '@/utils/bem.ts'

import '../styles/app-page-tabs.css'

const TabActionMenu = defineComponent({
  emits: [
    'close',
    'closeAfter',
    'closeBefore',
    'closeOther',
    'contextmenuVisibleChange',
    'pin',
    'refresh',
    'unpin',
  ],
  name: 'TabActionMenu',
  props: {
    data: {
      required: true,
      type: Object as PropType<TabActionMenuProps['data']>,
    },
    dataIndex: {
      required: true,
      type: Number as PropType<TabActionMenuProps['dataIndex']>,
    },
    disabled: {
      required: false,
      type: Object as PropType<TabActionMenuProps['disabled']>,
    },
    onClose: {
      required: false,
      type: Function as PropType<TabActionMenuProps['onClose']>,
    },
    onCloseAfter: {
      required: false,
      type: Function as PropType<TabActionMenuProps['onCloseAfter']>,
    },
    onCloseBefore: {
      required: false,
      type: Function as PropType<TabActionMenuProps['onCloseBefore']>,
    },
    onCloseOther: {
      required: false,
      type: Function as PropType<TabActionMenuProps['onCloseOther']>,
    },
    onPin: {
      required: false,
      type: Function as PropType<TabActionMenuProps['onPin']>,
    },
    onRefresh: {
      required: false,
      type: Function as PropType<TabActionMenuProps['onRefresh']>,
    },
    onUnpin: {
      required: false,
      type: Function as PropType<TabActionMenuProps['onUnpin']>,
    },
    trigger: {
      default: 'context-menu',
      required: false,
      type: String as PropType<TabActionMenuProps['trigger']>,
    },
  },
  setup(props: TabActionMenuProps, { emit, slots }) {
    const pageService = usePageService()
    const actionContext: Record<ContextmenuAction, TabDropdownAction> = {
      close: {
        icon: CloseIcon,
        label: trans('common.app.tab.close'),
        onClick: () => pageService.close(props.dataIndex),
      },
      closeAfter: {
        icon: ChevronRightDoubleIcon,
        label: trans('common.app.tab.closeAfter'),
        onClick: () => pageService.closeAfter(props.dataIndex),
      },
      closeBefore: {
        icon: ChevronLeftDoubleIcon,
        label: trans('common.app.tab.closeBefore'),
        onClick: () => pageService.closeBefore(props.dataIndex),
      },
      closeOther: {
        icon: ExpandHorizontalIcon,
        label: trans('common.app.tab.closeOther'),
        onClick: () => pageService.closeOther(props.dataIndex),
      },
      pin: {
        icon: LockCheckedIcon,
        label: trans('common.app.tab.pin'),
        onClick: () => pageService.pin(props.data.id),
      },
      refresh: {
        icon: RefreshIcon,
        label: trans('common.app.tab.refresh'),
        onClick: () => pageService.refresh(),
      },
      unpin: {
        icon: LockOffIcon,
        label: trans('common.app.tab.unpin'),
        onClick: () => pageService.unpin(props.data.id),
      },
    }

    const onTriggerAction = (action: ContextmenuAction) => {
      emit(action)
      actionContext[action]?.onClick()
    }

    return () => {
      const { disabled } = props
      const actionChunks: ContextmenuAction[][] = [
        ['close', 'refresh'],
        ['pin', 'unpin'],
        ['closeBefore', 'closeAfter', 'closeOther'],
      ]
      const dropdownItems: VNode[] = []

      actionChunks.forEach((actions, chunkIndex) => {
        actions.forEach((action, index) => {
          const { icon: ActionIcon, label } = actionContext[action]

          dropdownItems.push(
            <DropdownItem
              disabled={disabled?.[action]}
              divider={chunkIndex < actionChunks.length - 1 && index === actions.length - 1}
              key={action}
              onClick={() => onTriggerAction(action)}
            >
              <span class="inline-flex items-center gap-x-1.5">
                <ActionIcon></ActionIcon>
                {label}
              </span>
            </DropdownItem>,
          )
        })
      })

      return (
        <Dropdown
          minColumnWidth={120}
          popupProps={{ delay: 0 }}
          trigger={props.trigger}
        >
          {{
            default: slots.default,
            dropdown: () => {
              return <DropdownMenu>{dropdownItems}</DropdownMenu>
            },
          }}
        </Dropdown>
      )
    }
  },
})

const TabItem = defineComponent<TabItemProps>({
  name: 'AppTabItem',
  props: {
    data: {
      required: true,
      type: Object as PropType<TabItemProps['data']>,
    },
    dataIndex: {
      required: true,
      type: Number as PropType<TabItemProps['dataIndex']>,
    },
  },
  setup(props: TabItemProps) {
    const pageStore = usePageStore()
    const pageService = usePageService()

    return () => {
      const pined = pageStore.pined.has(props.data.id)
      const removable = !pined && (!props.data.defaultPined || !props.data.alwaysPined)
      const { data } = props

      const pinAction = (
        <span
          class={['ml-(--td-comp-margin-s)', 'flex', 'justify-center', 'items-center']}
          onClick={(e) => {
            e.stopPropagation()
            pageService.unpin(props.data.id)
          }}
        >
          <PinIcon
            class={[
              'h-(--text-lg)',
              'w-(--text-lg)',
              'p-0.5',
              'text-zinc-500',
              'hover:text-zinc-900',
              'transition-colors',
              'duration-200',
            ]}
            size="1.25rem"
          />
        </span>
      )
      const removeAction = (
        <span
          class={['ml-(--td-comp-margin-s)', 'flex', 'justify-center', 'items-center']}
          onClick={(e) => {
            e.stopPropagation()
            pageService.close(props.dataIndex)
          }}
        >
          <CloseIcon
            class={[
              'h-(--text-lg)',
              'w-(--text-lg)',
              'p-0.5',
              'text-zinc-500',
              'hover:text-rose-600',
              'transition-colors',
              'duration-200',
            ]}
            size="1.25rem"
          />
        </span>
      )

      return (
        <span class="inline-flex items-center justify-center">
          <span class="inline-flex items-center justify-center gap-x-1">
            {data.icon ? <Icon name={data.icon} /> : undefined}
            {data.title}
          </span>
          {pined ? pinAction : undefined}
          {removable ? removeAction : undefined}
        </span>
      )
    }
  },
})

const AppPageTabs = defineComponent({
  name: 'AppPageTabs',
  setup() {
    const router = useRouter()
    const routerStore = useRouterStore()
    const pageStore = usePageStore()
    const pageService = usePageService()
    const ns = useClassNs('app-page-tabs')

    const openedPages = computed<Page[]>(() => {
      const pages: Page[] = []
      pageStore.openedPages.forEach((page) => {
        if (page.path === routerStore.homePath) {
          pages.unshift(page)
        } else {
          pages.push(page)
        }
      })
      return pages
    })

    const createActionDisableOptions = (
      data: Page,
      index: number,
    ): Partial<TabActionMenuProps['disabled']> => {
      const pined = pageStore.pined.has(data.id)
      return {
        close: pined,
        closeAfter: index === pageStore.openedPages.length - 1,
        closeBefore: index === 0,
        pin: data.alwaysPined || pined,
        refresh: pageStore.current !== data.id,
        unpin: data.alwaysPined || !pined,
      }
    }
    const onTabChange = (value: TabValue) => {
      const name = String(value)
      router.push({ name })
    }
    const onTabSort = (context: TabsDragSortContext) => {
      pageService.move(context.currentIndex, context.targetIndex)
    }

    watch(
      router.currentRoute,
      (currentRoute) => {
        pageService.open(currentRoute)
      },
      { flush: 'sync', immediate: true },
    )

    return () => {
      const panels: VNode[] = []
      const pages = openedPages.value

      pages.forEach((item, index) => {
        panels.push(
          <TabPanel
            key={item.id}
            label={item.title}
            value={item.id}
          >
            {{
              label: () => {
                return (
                  <TabActionMenu
                    data={item}
                    dataIndex={index}
                    disabled={createActionDisableOptions(item, index)}
                  >
                    <TabItem
                      data={item}
                      dataIndex={index}
                    />
                  </TabActionMenu>
                )
              },
            }}
          </TabPanel>,
        )
      })

      const shortcuts = () => {
        const { currentIndex, currentPage } = pageStore
        if (currentPage) {
          return (
            <TabActionMenu
              data={currentPage}
              dataIndex={currentIndex}
              disabled={createActionDisableOptions(currentPage, currentIndex)}
              trigger="click"
            >
              <div
                class="border-l-divider flex h-full w-8 cursor-pointer items-center justify-center border-l"
                tabindex={0}
              >
                <ChevronDownIcon size="1.25rem" />
              </div>
            </TabActionMenu>
          )
        }
      }

      return (
        <div class={ns.b()}>
          <div class="h-full px-2 py-0.5">
            <Tabs
              class="h-full bg-transparent!"
              dragSort={true}
              onChange={onTabChange}
              onDragSort={onTabSort}
              theme="card"
              value={pageStore.current}
            >
              {panels}
            </Tabs>
          </div>
          {shortcuts()}
        </div>
      )
    }
  },
})

export { AppPageTabs as default }
