<script setup lang="ts">
import HeaderLayout from '@/pages/core/panel/components/HeaderLayout.vue'
import SidebarLayout from '@/pages/core/panel/components/SidebarLayout.vue'
</script>

<template>
  <div class="flex">
    <div class="w-[20%] max-w-60">
      <sidebar-layout></sidebar-layout>
    </div>
    <div>
      <header-layout></header-layout>
    </div>
  </div>
</template>

<style scoped></style>
