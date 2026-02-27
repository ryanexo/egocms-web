import type {
  PopupProps,
  PopupVisibleChangeContext,
  TabsDragSortContext,
  TabValue,
} from 'tdesign-vue-next'
import type { PropType, VNode } from 'vue'

import {
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
import { computed, defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import type {
  ContextmenuAction,
  TabDropdownAction,
  TabPanelLabelProps,
} from '@/pages/core/layout/types/page-tabs'
import type { Page } from '@/stores/types/page'

import { trans } from '@/locales'
import { usePageService } from '@/services'
import { usePageStore, useRouterStore } from '@/stores'

import styles from '../styles/page-tabs.module.css'

const TabPanelLabel = defineComponent<TabPanelLabelProps>({
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
  name: 'TabPanelLabel',
  props: {
    contextmenuMinWidth: {
      default: 120,
      type: Number as PropType<TabPanelLabelProps['contextmenuMinWidth']>,
    },
    contextmenuVisible: {
      default: false,
      type: Boolean as PropType<TabPanelLabelProps['contextmenuVisible']>,
    },
    data: {
      required: true,
      type: Object as PropType<TabPanelLabelProps['data']>,
    },
    dataIndex: {
      required: true,
      type: Number as PropType<TabPanelLabelProps['dataIndex']>,
    },
    disableActions: {
      required: false,
      type: Object as PropType<TabPanelLabelProps['disableActions']>,
    },
    onClose: {
      required: false,
      type: Function as PropType<TabPanelLabelProps['onClose']>,
    },
    onCloseAfter: {
      required: false,
      type: Function as PropType<TabPanelLabelProps['onCloseAfter']>,
    },
    onCloseBefore: {
      required: false,
      type: Function as PropType<TabPanelLabelProps['onCloseBefore']>,
    },
    onCloseOther: {
      required: false,
      type: Function as PropType<TabPanelLabelProps['onCloseOther']>,
    },
    onPin: {
      required: false,
      type: Function as PropType<TabPanelLabelProps['onPin']>,
    },
    onRefresh: {
      required: false,
      type: Function as PropType<TabPanelLabelProps['onRefresh']>,
    },
    onUnpin: {
      required: false,
      type: Function as PropType<TabPanelLabelProps['onUnpin']>,
    },
  },
  setup(props: TabPanelLabelProps, { emit }) {
    const pageStore = usePageStore()
    const pageService = usePageService()

    const actionIcon: Record<ContextmenuAction, TabDropdownAction> = {
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
      actionIcon[action]?.onClick()
    }

    return () => {
      const pined = pageStore.pined.has(props.data.id)
      const removable = !pined && (!props.data.defaultPined || !props.data.alwaysPined)
      const { contextmenuMinWidth, contextmenuVisible, data, disableActions } = props

      const actionChunks: ContextmenuAction[][] = [
        ['close', 'refresh'],
        ['pin', 'unpin'],
        ['closeBefore', 'closeAfter', 'closeOther'],
      ]
      const dropdownItems: VNode[] = []

      actionChunks.forEach((actions, chunkIndex) => {
        actions.forEach((action, index) => {
          const { icon: ActionIcon, label } = actionIcon[action]

          dropdownItems.push(
            <DropdownItem
              disabled={disableActions?.[action]}
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

      const popupProps: PopupProps = {
        onVisibleChange: (visible, context) => emit('contextmenuVisibleChange', visible, context),
        visible: contextmenuVisible,
      }

      const pinAction = (
        <span
          class={['ml-(--td-comp-margin-s)', 'flex', 'justify-center', 'items-center']}
          onClick={(e) => {
            e.stopPropagation()
            onTriggerAction('unpin')
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
          />
        </span>
      )
      const removeAction = (
        <span
          class={['ml-(--td-comp-margin-s)', 'flex', 'justify-center', 'items-center']}
          onClick={(e) => {
            e.stopPropagation()
            onTriggerAction('close')
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
        <Dropdown
          minColumnWidth={contextmenuMinWidth}
          popupProps={popupProps}
          trigger="context-menu"
        >
          {{
            default: () => {
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
            },
            dropdown: () => {
              return <DropdownMenu>{dropdownItems}</DropdownMenu>
            },
          }}
        </Dropdown>
      )
    }
  },
})

const PageTabs = defineComponent({
  name: 'PageTabs',
  setup() {
    const router = useRouter()
    const routerStore = useRouterStore()
    const pageStore = usePageStore()
    const pageService = usePageService()

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

    const contextmenuActiveName = ref()

    const onTabChange = (value: TabValue) => {
      const name = String(value)
      router.push({ name })
    }
    const onTabClose = () => {
      contextmenuActiveName.value = undefined
    }
    const onTabSort = (context: TabsDragSortContext) => {
      pageService.move(context.currentIndex, context.targetIndex)
    }
    const onPopupVisibleChange = (page: Page, visible: boolean, ctx: PopupVisibleChangeContext) => {
      if (ctx.trigger === 'document') {
        contextmenuActiveName.value = undefined
      } else {
        contextmenuActiveName.value = visible ? page.id : undefined
      }
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
        const pined = pageStore.pined.has(item.id)
        const disableActions: Partial<TabPanelLabelProps['disableActions']> = {
          close: pined,
          closeAfter: index === pages.length - 1,
          closeBefore: index === 0,
          pin: item.alwaysPined || pined,
          refresh: pageStore.current !== item.id,
          unpin: item.alwaysPined || !pined,
        }

        panels.push(
          <TabPanel
            key={item.id}
            label={item.title}
            value={item.id}
          >
            {{
              label: () => {
                return (
                  <TabPanelLabel
                    contextmenuVisible={contextmenuActiveName.value === item.id}
                    data={item}
                    dataIndex={index}
                    disableActions={disableActions}
                    key={item.id}
                    onClose={onTabClose}
                    onContextmenuVisibleChange={(visible, context) =>
                      onPopupVisibleChange(item, visible, context)
                    }
                  />
                )
              },
            }}
          </TabPanel>,
        )
      })

      return (
        <div
          class={[
            styles.pageTabs,
            'bg-(--page-tabs-bg)',
            'flex',
            'flex-col',
            'justify-center',
            'p-0.5',
            'border-b',
            'border-b-gray-line',
          ]}
        >
          <Tabs
            class="bg-transparent!"
            dragSort={true}
            onChange={onTabChange}
            onDragSort={onTabSort}
            theme="card"
            value={pageStore.current}
          >
            {panels}
          </Tabs>
        </div>
      )
    }
  },
})

export { PageTabs as default }
