<script setup lang="ts">
import {
  ControlPlatformFilledIcon,
  TaskDoubleFilledIcon,
  UserSafetyFilledIcon,
} from 'tdesign-icons-vue-next'

import { trans } from '@/locales'

const brand = {
  items: [
    {
      description: trans('auth.brand.details.safe.description'),
      icon: UserSafetyFilledIcon,
      title: trans('auth.brand.details.safe.title'),
    },
    {
      description: trans('auth.brand.details.perm.description'),
      icon: ControlPlatformFilledIcon,
      title: trans('auth.brand.details.perm.title'),
    },
    {
      description: trans('auth.brand.details.content.description'),
      icon: TaskDoubleFilledIcon,
      title: trans('auth.brand.details.content.title'),
    },
  ],
  slogan: trans('auth.brand.slogan'),
  title: trans('auth.brand.title'),
}
</script>

<template>
  <div
    class="bg-primary relative hidden flex-1 items-center justify-center overflow-hidden p-12 lg:flex lg:w-0"
  >
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-20 left-20 h-72 w-72 rounded-full bg-white blur-3xl"></div>
      <div class="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-white blur-3xl"></div>
    </div>

    <div class="relative z-10 max-w-lg space-y-6 text-white">
      <h2 class="text-center text-4xl font-bold">{{ brand.title }}</h2>
      <p class="mt-4 mb-16 text-center text-xl text-blue-200">
        {{ brand.slogan }}
      </p>

      <div class="flex flex-col gap-y-6">
        <div
          class="flex gap-x-2"
          v-for="(item, index) of brand.items"
          :key="index"
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
            <component
              :is="item.icon"
              size="24px"
            />
          </div>
          <div class="flex flex-col justify-between py-1">
            <h2 class="text-[16px]/[16px]">{{ item.title }}</h2>
            <h4 class="text-[14px]/[14px] text-blue-200">
              {{ item.description }}
            </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
