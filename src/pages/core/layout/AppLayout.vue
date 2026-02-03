<script setup lang="ts">
import type { VNode } from 'vue'
import type { RouteLocationNormalizedGeneric } from 'vue-router'

import { isNil } from 'es-toolkit'

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

  if (isNil(component.type)) {
    component.type = { name: newName }
  } else if (typeof component.type === 'object') {
    const type = component.type as Record<string, any>
    type.name = newName
  }

  return component
}
</script>

<template>
  <div class="base-layout flex h-full w-full">
    <div class="h-full w-60 shrink-0">
      <sidebar-layout></sidebar-layout>
    </div>
    <div class="h-full w-0 grow">
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
