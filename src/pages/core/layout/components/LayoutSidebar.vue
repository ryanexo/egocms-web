<script setup lang="ts">
import NestedMenu from '@/pages/core/layout/components/NestedMenu.tsx'
</script>

<template>
  <div class="menu flex h-full flex-col px-2 pt-4 pb-8">
    <nested-menu />
    <t-divider> <span class="text-t-muted">关于系统</span> </t-divider>
    <span class="text-t-secondary flex items-center justify-center gap-x-2 text-sm">
      <t-link>授权查询</t-link>
      <span>|</span>
      <t-link>官方网站</t-link>
    </span>
  </div>
</template>

<style></style>
