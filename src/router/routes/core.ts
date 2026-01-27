import type { RouteRecordRaw } from 'vue-router'

import AuthPage from '@/pages/core/auth/AuthPage.vue'
import LoginPage from '@/pages/core/auth/LoginPage.vue'
import FrameworkLayout from '@/pages/core/framework/FrameworkLayout.vue'
import { CoreRouteNameEnum, CoreRoutePathEnum } from '@/router/constants/route.enum.ts'

const routes: RouteRecordRaw[] = [
  {
    children: [],
    component: FrameworkLayout,
    meta: {
      icon: '',
      permission: [],
      requiresAuth: true,
      title: '主页',
    },
    name: CoreRouteNameEnum.Home,
    path: CoreRoutePathEnum.Home,
  },
  {
    children: [
      {
        component: LoginPage,
        meta: {
          icon: '',
          permission: [],
          requiresAuth: false,
          title: '登录',
        },
        name: CoreRouteNameEnum.Login,
        path: CoreRoutePathEnum.Login,
      },
      {
        component: LoginPage,
        meta: {
          icon: '',
          permission: [],
          requiresAuth: false,
          title: '注册',
        },
        name: CoreRouteNameEnum.Register,
        path: CoreRoutePathEnum.Register,
      },
    ],
    component: AuthPage,
    name: CoreRouteNameEnum.Auth,
    path: CoreRoutePathEnum.Auth,
    redirect: { name: CoreRouteNameEnum.Login },
  },
]

export default routes
