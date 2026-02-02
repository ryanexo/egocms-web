<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppMenu from '@/pages/core/layout/components/Menu.tsx'
import { useRouterStore } from '@/stores'

const route = useRoute()
const routerStore = useRouterStore()

const currentActivatedMenu = computed(() => String(route.name))
</script>

<template>
  <div class="menu flex h-full">
    <t-menu
      class="w-full!"
      theme="dark"
      :value="currentActivatedMenu"
    >
      <AppMenu :menus="routerStore.routes"></AppMenu>
    </t-menu>
  </div>
</template>

<style scoped lang="scss">
.menu {
  --td-gray-color-13: var(--color-gray-900);

  background: var(--color-gray-900);
}
</style>
