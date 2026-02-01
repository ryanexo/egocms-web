<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'

import HeaderLayout from '@/pages/core/layout/components/HeaderLayout.vue'
import SidebarLayout from '@/pages/core/layout/components/SidebarLayout.vue'
import { usePageService } from '@/services'
import { usePageStore } from '@/stores'

const router = useRouter()
const pageStore = usePageStore()

watch(router.currentRoute, (route) => usePageService().addOpenedPage(route))
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
