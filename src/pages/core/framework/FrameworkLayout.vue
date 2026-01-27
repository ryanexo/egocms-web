<script setup lang="ts">
import HeaderLayout from '@/pages/core/framework/components/HeaderLayout.vue'
import SidebarLayout from '@/pages/core/framework/components/SidebarLayout.vue'
import { usePageStore } from '@/stores'

const pageStore = usePageStore()
</script>

<template>
  <div class="base-layout flex h-screen">
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
              :key="route.fullPath"
              :exclude="pageStore.flatSkipCache"
            >
              <component
                v-if="pageStore.pageVisible"
                :is="Component"
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
