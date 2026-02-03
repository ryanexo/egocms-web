import type { RouteRecordRaw } from 'vue-router'

import DashboardPage from '@/pages/core/dashboard/DashboardPage.vue'
import { CoreRouteNameEnum, CoreRoutePathEnum } from '@/router/constants/route.enum.ts'

const routes: RouteRecordRaw[] = [
  {
    component: DashboardPage,
    meta: {
      affix: true,
      affixCancelable: false,
      icon: '',
      permission: [],
      requiresAuth: true,
      title: '控制台',
    },
    name: CoreRouteNameEnum.Dashboard,
    path: CoreRoutePathEnum.Dashboard,
  },
]

export default routes
