<script setup lang="ts">
import {
  ControlPlatformFilledIcon,
  RocketFilledIcon,
  TaskDoubleFilledIcon,
  UserSafetyFilledIcon,
} from 'tdesign-icons-vue-next'

const brand = {
  items: [
    {
      description: '多层安全防护机制，保障内容与数据安全无忧',
      icon: UserSafetyFilledIcon,
      title: '安全可靠',
    },
    {
      description: '精细化权限管理，确保内容发布各司其职',
      icon: ControlPlatformFilledIcon,
      title: '权限可控',
    },
    {
      description: '统一管理多类型内容，结构清晰、查找便捷',
      icon: TaskDoubleFilledIcon,
      title: '内容高效管理',
    },
  ],
  slogan: '让管理更简单，让发布更可靠，一起探索无限可能',
  title: '内容，从这里开始',
}
</script>

<template>
  <div class="flex min-h-screen w-screen">
    <div class="flex flex-1 flex-col items-center justify-center gap-y-6">
      <div class="bg-primary flex h-16 w-16 items-center justify-center rounded-2xl">
        <RocketFilledIcon
          size="32px"
          fill-color="#fff"
        />
      </div>

      <div class="flex flex-col gap-y-2 text-center">
        <h1 class="text-3xl">欢迎回来</h1>
        <h3 class="text-gray-500">请登录您的账户继续</h3>
      </div>

      <div class="max-w-lg"></div>
    </div>

    <div class="bg-primary relative hidden flex-1 items-center justify-center overflow-hidden p-12 lg:flex lg:w-0">
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
  </div>
</template>

<style scoped></style>
