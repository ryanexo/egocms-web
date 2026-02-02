<script setup lang="ts">
import type { VNode } from 'vue'
import type { RouteLocationNormalizedGeneric } from 'vue-router'

import HeaderLayout from '@/pages/core/layout/components/HeaderLayout.vue'
import SidebarLayout from '@/pages/core/layout/components/SidebarLayout.vue'
import { usePageStore } from '@/stores'

const pageStore = usePageStore()

function renameUsingRoute(route: RouteLocationNormalizedGeneric, component: VNode) {
  const newName = route.name
  if (typeof newName !== 'string' || newName.length === 0) {
    return component
  }

  const originalName = (component.type as Record<string, string>)?.name
  if (newName === originalName) {
    return component
  }

  const type: Record<string, any> = typeof component.type === 'object' ? component.type : {}
  type.name = newName

  return component
}
</script>

<template>
  <div class="base-layout flex h-full w-full">
    <div class="w-[20%] max-w-60">
      <sidebar-layout></sidebar-layout>
    </div>
    <div>
      <header-layout></header-layout>
      <router-view>
        <template #default="{ Component, route }">
          <transition
            appear
            name="fade-slide"
            mode="out-in"
          >
            <keep-alive
              :include="pageStore.opened"
              :exclude="pageStore.flatSkipCache"
            >
              <component
                v-if="pageStore.visible"
                :key="route.fullPath"
                :is="renameUsingRoute(route, Component)"
              />
            </keep-alive>
          </transition>
        </template>
      </router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-layout {
}
</style>
