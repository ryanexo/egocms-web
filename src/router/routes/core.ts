import type { RouteRecordRaw } from 'vue-router'

import Authentication from '@/pages/core/Authentication.vue'
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
    component: Authentication,
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
    component: Authentication,
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
