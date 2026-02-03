<script setup lang="ts">
import type { TabValue } from 'tdesign-vue-next'

import { watch } from 'vue'
import { useRouter } from 'vue-router'

import { usePageService } from '@/services'
import { usePageStore } from '@/stores'

const router = useRouter()
const pageStore = usePageStore()
const pageService = usePageService()

function onTabChange(value: TabValue) {
  const name = String(value)
  router.push({ name })
}
function onTabRemove(options: { value: TabValue }) {
  const name = String(options.value)
  pageService.closePage(name)
}

watch(
  router.currentRoute,
  (currentRoute) => {
    pageService.openPage(currentRoute)
  },
  { flush: 'sync', immediate: true },
)
</script>

<template>
  <div class="app-layout__header">
    <div class="h-15 border-b border-b-gray-100 bg-white"></div>
    <div class="bg-(--td-bg-color-secondarycontainer) px-4">
      <t-tabs
        theme="card"
        :value="pageStore.current"
        @change="onTabChange"
      >
        <t-tab-panel
          v-for="item of pageStore.openedPages"
          :key="item.id"
          :label="item.title"
          :value="item.id"
          :removable="!item.affix || item.affixCancelable"
          @remove="onTabRemove"
        />
      </t-tabs>
    </div>
  </div>
</template>

<style scoped>
.app-layout__header {
  --td-comp-size-xxl: 2rem;
}
</style>
