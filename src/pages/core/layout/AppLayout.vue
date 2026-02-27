<script setup lang="ts">
import AppLogo from '@/pages/core/layout/components/AppLogo.vue'
import LayoutContent from '@/pages/core/layout/components/LayoutContent.vue'
import LayoutHeader from '@/pages/core/layout/components/LayoutHeader.vue'
import LayoutSidebar from '@/pages/core/layout/components/LayoutSidebar.vue'
import { useClassNs } from '@/utils/bem.ts'

const ns = useClassNs('app-layout')
</script>

<template>
  <div
    class="flex h-full w-full"
    :class="[ns.b()]"
  >
    <div
      class="w-sidebar border-r-gray-line bg-sidebar-bg relative flex h-full shrink-0 flex-col border-r"
    >
      <app-logo
        class="shrink-0"
        :class="[ns.e('logo')]"
      />
      <layout-sidebar
        class="h-0 grow"
        :class="[ns.e('sidebar')]"
      />
    </div>
    <div class="relative flex h-full min-w-0 grow flex-col">
      <layout-header
        class="shrink-0"
        :class="ns.e('header')"
      />
      <div
        class="relative h-auto grow overflow-y-auto"
        :class="[ns.e('content')]"
      >
        <layout-content />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
