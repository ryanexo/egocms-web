<script setup lang="ts">
import { RouterView } from 'vue-router'

import { usePageStore } from '@/stores'

const pageStore = usePageStore()
</script>

<template>
  <t-config-provider>
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
  </t-config-provider>
</template>
