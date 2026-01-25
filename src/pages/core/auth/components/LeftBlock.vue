<script setup lang="ts">
import { RocketFilledIcon } from 'tdesign-icons-vue-next'

import LoginForm from '@/pages/core/auth/components/LoginForm.vue'
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center gap-y-6">
    <div class="bg-primary flex h-16 w-16 items-center justify-center rounded-2xl">
      <rocket-filled-icon
        size="32px"
        fill-color="#fff"
      />
    </div>

    <div class="flex flex-col gap-y-2 text-center">
      <h1 class="text-3xl">欢迎回来</h1>
      <h3 class="text-gray-500">请登录您的账户继续</h3>
    </div>

    <div class="mt-4 max-w-lg">
      <login-form />
    </div>
  </div>
</template>

<style scoped></style>
