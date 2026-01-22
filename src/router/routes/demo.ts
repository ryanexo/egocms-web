import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    component: () => import('@/pages/AboutView.vue'),
    meta: {
      icon: '',
      parent: '',
      permission: [],
      requiresAuth: false,
      sequence: '0',
      title: '关于我们',
    },
    name: '关于我们',
    path: '/about',
  },
  {
    component: () => import('@/pages/HomeView.vue'),
    meta: {
      icon: '',
      parent: '',
      permission: [],
      requiresAuth: false,
      sequence: '0',
      title: '主页',
    },
    name: '主页',
    path: '/',
  },
] as RouteRecordRaw[]
