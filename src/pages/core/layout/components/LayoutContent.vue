<script setup lang="ts">
import type { VNode } from 'vue'
import type { RouteLocationNormalizedGeneric } from 'vue-router'

import { isNil } from 'es-toolkit'

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
  <router-view>
    <template #default="{ Component, route }">
      <transition
        appear
        name="fade-slide"
        mode="out-in"
      >
        <keep-alive
          ref="keepAliveRef"
          :include="pageStore.opened"
          :exclude="pageStore.flatSkipCache"
        >
          <component
            v-if="pageStore.visible"
            :key="route.name"
            :is="renameUsingRoute(route, Component)"
          />
        </keep-alive>
      </transition>
    </template>
  </router-view>
</template>

<style scoped></style>
