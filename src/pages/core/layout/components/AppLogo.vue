<script setup lang="ts">
import { useAppStore } from '@/stores'

const appStore = useAppStore()
</script>

<template>
  <div class="border-b-divider flex h-(--app-header) w-full items-center justify-center border-b">
    <span
      v-if="!appStore.sidebarCollapsed"
      class="text-primary text-2xl font-bold uppercase"
    >
      egocms
    </span>
  </div>
</template>

<style scoped></style>
