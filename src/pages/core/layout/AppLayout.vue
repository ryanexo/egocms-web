<script setup lang="ts">
import AppLogo from '@/pages/core/layout/components/AppLogo.vue'
import LayoutContent from '@/pages/core/layout/components/LayoutContent.vue'
import LayoutHeader from '@/pages/core/layout/components/LayoutHeader.vue'
import LayoutSidebar from '@/pages/core/layout/components/LayoutSidebar.vue'
</script>

<template>
  <div class="layout flex h-full w-full">
    <div
      class="relative flex h-full w-(--app-sidebar-size) shrink-0 flex-col border-r border-(--app-border-color) bg-white"
    >
      <app-logo class="shrink-0" />
      <layout-sidebar class="h-0 grow" />
    </div>
    <div class="relative flex h-full min-w-3xl grow flex-col">
      <layout-header class="shrink-0"></layout-header>
      <div class="h-auto overflow-y-auto lg:h-0 lg:grow">
        <layout-content />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-layout {
}
</style>
