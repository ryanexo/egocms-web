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
    <div class="border-r-divider bg-sidebar-bg relative flex h-full shrink-0 flex-col border-r">
      <app-logo
        class="shrink-0"
        :class="[ns.e('logo')]"
      />
      <layout-sidebar
        class="transition-base h-0 grow"
        :class="[ns.e('sidebar')]"
      />
    </div>
    <div class="relative h-full min-w-0 grow">
      <layout-header
        class="absolute top-0 left-0 z-1 w-full"
        :class="ns.e('header')"
      />
      <div
        class="relative h-full grow overflow-y-auto pt-(--app-header-height)"
        :class="[ns.e('content')]"
      >
        <layout-content />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  &__sidebar {
    &.is-collapsed {
      --app-sidebar-width: calc(var(--spacing) * 20);
    }
  }
}
</style>
