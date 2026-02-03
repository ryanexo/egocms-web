<script setup lang="ts">
import type { PopupVisibleChangeContext, TabsDragSortContext, TabValue } from 'tdesign-vue-next'

import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, RefreshIcon } from 'tdesign-icons-vue-next'
import { DropdownMenu as TDropdownMenu } from 'tdesign-vue-next'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import type { Page } from '@/stores/types/page'

import { trans } from '@/locales'
import { usePageService } from '@/services'
import { usePageStore, useRouterStore } from '@/stores'

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

function isActive(page: Page) {
  return page.id === pageStore.current
}

function onTabChange(value: TabValue) {
  const name = String(value)
  router.push({ name })
}
function onTabRemove(options: { value: TabValue }) {
  const name = String(options.value)
  pageService.close(name)
}
function onTabSort(context: TabsDragSortContext) {
  pageService.move(String(context.current), context.targetIndex)
}
function onPopupVisibleChange(page: Page, visible: boolean, ctx: PopupVisibleChangeContext) {
  if (ctx.trigger === 'document') {
    contextmenuActiveName.value = undefined
  } else if (visible) {
    contextmenuActiveName.value = page.id
  } else {
    contextmenuActiveName.value = undefined
  }
}

watch(
  router.currentRoute,
  (currentRoute) => {
    pageService.open(currentRoute)
  },
  { flush: 'sync', immediate: true },
)
</script>

<template>
  <div class="tab-area border-b border-(--app-border-color)">
    <t-tabs
      class="bg-transparent!"
      theme="card"
      :drag-sort="true"
      :value="pageStore.current"
      @change="onTabChange"
      @drag-sort="onTabSort"
    >
      <t-tab-panel
        v-for="(item, index) of openedPages"
        :key="item.id"
        :label="item.title"
        :value="item.id"
        :removable="!item.affix || item.affixCancelable"
        @remove="onTabRemove"
      >
        <template #label>
          <t-dropdown
            trigger="context-menu"
            :min-column-width="128"
            :popup-props="{
              onVisibleChange: (visible, context) => onPopupVisibleChange(item, visible, context),
              visible: contextmenuActiveName === item.id,
            }"
          >
            <template #default>
              <span class="inline-flex items-center justify-center gap-x-1">
                <t-icon
                  v-if="item.icon"
                  :name="item.icon"
                />
                {{ item.title }}
              </span>
            </template>

            <template #dropdown>
              <t-dropdown-menu>
                <t-dropdown-item
                  v-if="isActive(item)"
                  @click="pageService.refresh()"
                >
                  <span class="inline-flex items-center gap-x-1.5">
                    <refresh-icon />
                    {{ trans('common.app.tab.refresh') }}
                  </span>
                </t-dropdown-item>
                <t-dropdown-item @click="pageService.close(item.id)">
                  <span class="inline-flex items-center gap-x-1.5">
                    <close-icon />
                    {{ trans('common.app.tab.close') }}
                  </span>
                </t-dropdown-item>
                <t-dropdown-item
                  v-if="index > 0"
                  @click="pageService.closeBefore(index)"
                >
                  <span class="inline-flex items-center gap-x-1.5">
                    <arrow-left-icon />
                    {{ trans('common.app.tab.closeBefore') }}
                  </span>
                </t-dropdown-item>
                <t-dropdown-item
                  v-if="index < openedPages.length - 1"
                  @click="pageService.closeAfter(index)"
                >
                  <span class="inline-flex items-center gap-x-1.5">
                    <arrow-right-icon />
                    {{ trans('common.app.tab.closeAfter') }}
                  </span>
                </t-dropdown-item>
                <t-dropdown-item
                  v-if="openedPages.length > 2"
                  @click="pageService.closeOther(index)"
                >
                  <span class="inline-flex items-center gap-x-1.5">
                    <close-icon />
                    {{ trans('common.app.tab.closeOther') }}
                  </span>
                </t-dropdown-item>
              </t-dropdown-menu>
            </template>
          </t-dropdown>
        </template>
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<style scoped lang="scss">
.tab-area {
  --td-comp-size-xxl: var(--text-4xl);
  --td-bg-color-secondarycontainer-hover: var(--color-gray-100);

  background: var(--color-white);
  padding: calc(var(--spacing) * 1);

  :deep(.t-tabs__nav-container.t-tabs__nav--card) {
    background-color: white;
  }

  :deep(.t-tabs__nav-wrap) {
    row-gap: calc(var(--spacing) * 1);
    column-gap: calc(var(--spacing) * 1);
  }

  :deep(.t-tabs__nav--card.t-tabs__nav-item) {
    transition-timing-function: linear;
    transition-duration: 0.1s;
    transition-property: border-color, background-color;
    background: white;
    border-radius: var(--radius-md);
    border: none;

    &:not(.t-is-disabled):not(.t-is-active):hover {
      background-color: var(--app-background-color);
      border-color: var(--app-border-color);
    }

    &.t-is-active {
      background-color: var(--app-background-color);
    }

    .t-icon-close {
      width: var(--text-xl);
      height: var(--text-xl);
      padding: 0.125rem;

      &:hover {
        background: var(--app-background-color-hover);
        transition: 0.05s linear all;
        border-radius: 100%;
      }
    }
  }
}
</style>
