<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { ref } from 'vue'

const count = ref(0)

useIntervalFn(() => count.value++, 500)
</script>

<template>
  <div>
    {{ count }}
  </div>
</template>

<style scoped></style>
