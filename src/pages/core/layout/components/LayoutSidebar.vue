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
      appStore.sidebarCollapsed ? 'is-collapsed' : null,
      classNs.b(),
      'flex',
      'h-full',
      'flex-col',
    ]"
  >
    <app-menu />
  </div>
</template>

<style scoped></style>
