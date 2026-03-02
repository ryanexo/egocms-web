<script setup lang="ts">
import { ChevronLeftDoubleIcon } from 'tdesign-icons-vue-next'

import AppMenu from '@/pages/core/layout/components/AppMenu.tsx'
import { useAppStore } from '@/stores'
import { useClassNs } from '@/utils/bem.ts'

const appStore = useAppStore()
const classNs = useClassNs('app-sidebar')

function onExpand() {
  appStore.toggleSidebarCollapsed()
}
</script>

<template>
  <div
    :class="[
      appStore.sidebarCollapsed ? 'is-collapsed' : null,
      classNs.b(),
      'flex',
      'h-full',
      'flex-col',
    ]"
  >
    <app-menu />
    <div class="p-(--td-comp-paddingLR-s)">
      <div :class="[classNs.e('collapse'), 'flex', 'items-center', 'justify-end']">
        <t-button
          variant="text"
          @click="onExpand"
        >
          <chevron-left-double-icon :class="[classNs.e('collapse-icon'), 'text-t-secondary']" />
        </t-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-sidebar {
  &.is-collapsed &__collapse-icon {
    transform: rotate(180deg);
  }
}
</style>
