<script setup lang="ts">
import AppMenu from '@/pages/core/layout/components/AppMenu.tsx'
import { useAppStore } from '@/stores'
import { useClassNs } from '@/utils/bem.ts'

const appStore = useAppStore()
const classNs = useClassNs('app-sidebar')
</script>

<template>
  <div
    :class="[
      classNs.b(),
      appStore.sidebarCollapsed ? 'is-collapsed' : null,
      'flex',
      'h-full',
      'flex-col',
      'transition-all',
    ]"
  >
    <app-menu />
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.app-sidebar {
  width: var(--app-sidebar-width);

  &.is-collapsed {
    @apply w-16;
  }
}
</style>
