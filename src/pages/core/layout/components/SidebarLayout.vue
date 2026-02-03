<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import NestedMenuItem from '@/pages/core/layout/components/NestedMenuItem.tsx'
import { useRouterStore } from '@/stores'

const route = useRoute()
const routerStore = useRouterStore()

const currentActivatedMenu = computed(() => String(route.name))
</script>

<template>
  <div class="menu flex h-full">
    <t-menu
      class="w-full!"
      :value="currentActivatedMenu"
    >
      <nested-menu-item :menus="routerStore.routes"></nested-menu-item>
    </t-menu>
  </div>
</template>

<style scoped lang="scss">
.menu {
  --td-gray-color-13: var(--color-gray-900);

  background: var(--color-gray-900);
}
</style>
