import type { RouteRecordRaw } from 'vue-router'

import AuthenticationPage from '@/pages/core/auth/AuthenticationPage.vue'
import HomeView from '@/pages/HomeView.vue'
import {
  CoreRouteNameEnum,
  CoreRoutePathEnum,
} from '@/router/constants/route.enum.ts'

export default [
  {
    component: HomeView,
    meta: {
      icon: '',
      parent: '',
      permission: [],
      requiresAuth: true,
      title: '主页',
    },
    name: CoreRouteNameEnum.Home,
    path: CoreRoutePathEnum.Home,
  },
  {
    component: AuthenticationPage,
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
    component: AuthenticationPage,
    meta: {
      icon: '',
      permission: [],
      requiresAuth: false,
      title: '注册',
    },
    name: CoreRouteNameEnum.Register,
    path: CoreRoutePathEnum.Register,
  },
] as RouteRecordRaw[]
