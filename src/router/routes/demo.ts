import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    component: import('@/pages/AboutView.vue'),
    name: '关于我们',
    path: '/about',
  },
  {
    component: import('@/pages/HomeView.vue'),
    name: '主页',
    path: '/',
  },
] as RouteRecordRaw[]
