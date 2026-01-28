<script setup lang="ts">
import { ArrowLeftIcon } from 'tdesign-icons-vue-next'
import { useRouter } from 'vue-router'

import FullscreenLayout from '@/pages/core/layout/FullscreenLayout.vue'
import { CoreRoutePathEnum } from '@/router/constants/route.enum.ts'

import notfound from './images/notfound.svg'

const router = useRouter()
</script>

<template>
  <fullscreen-layout>
    <div class="flex h-full w-full flex-col items-center justify-center gap-y-10">
      <div class="text-primary w-60">
        <notfound />
      </div>
      <div class="flex flex-col items-center justify-center gap-y-4 text-center">
        <span class="text-3xl leading-8 font-bold">404 Not Found</span>
        <span class="text-t-secondary leading-3">抱歉，您访问的页面不存在</span>
      </div>
      <t-button @click="router.replace(CoreRoutePathEnum.Home)">
        <template #icon>
          <arrow-left-icon />
        </template>
        返回首页
      </t-button>
    </div>
  </fullscreen-layout>
</template>

<style scoped></style>
