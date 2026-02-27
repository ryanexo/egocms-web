<script setup lang="ts">
import { ArrowLeftIcon } from 'tdesign-icons-vue-next'
import { useRouter } from 'vue-router'

import { trans } from '@/locales'
import FullscreenLayout from '@/pages/core/layout/FullscreenLayout.vue'
import { CoreRoutePathEnum } from '@/router/constants/route.enum.ts'
import { useRouterStore } from '@/stores'

import notfound from './images/notfound.svg'

const router = useRouter()
const routerStore = useRouterStore()

function onGobackHome() {
  const homePath = routerStore.homePath ?? CoreRoutePathEnum.Home
  router.replace(homePath)
}
</script>

<template>
  <fullscreen-layout>
    <div class="mt-auto mb-auto flex w-full flex-col items-center justify-center gap-y-10">
      <div class="text-primary w-60">
        <notfound />
      </div>
      <div class="flex flex-col items-center justify-center gap-y-4 text-center">
        <span class="text-3xl leading-8 font-bold">{{ trans('fallback.notFound.title') }}</span>
        <span class="text-t-secondary leading-6">{{ trans('fallback.notFound.subtitle') }}</span>
      </div>
      <t-button @click="onGobackHome">
        <template #icon>
          <arrow-left-icon />
        </template>
        {{ trans('fallback.notFound.goback') }}
      </t-button>
    </div>
  </fullscreen-layout>
</template>

<style scoped></style>
