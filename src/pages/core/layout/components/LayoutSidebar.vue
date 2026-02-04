<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import NestedMenuItem from '@/pages/core/layout/components/NestedMenuItem.tsx'
import { useRouterStore } from '@/stores'

const route = useRoute()
const routerStore = useRouterStore()

const activeMenu = computed(() => String(route.name))
const expanded = ref<string[]>([])

watch(
  () => route.name,
  (name) => {
    expanded.value = routerStore.findAncestor(String(name)).map((item) => item.name as string)
  },
  { flush: 'sync', immediate: true },
)
</script>

<template>
  <div class="menu flex h-full">
    <t-menu
      class="w-full!"
      v-model:expanded="expanded"
      :value="activeMenu"
      :expand-mutex="true"
    >
      <nested-menu-item :menus="routerStore.routes"></nested-menu-item>
    </t-menu>
  </div>
</template>

<style>
.menu {
  .t-default-menu .t-menu__item.t-is-active:not(.t-is-opened) {
  }
}
</style>
