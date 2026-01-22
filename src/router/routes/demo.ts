import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    component: () => import('@/pages/AboutView.vue'),
    meta: {
      icon: '',
      parent: '',
      permission: [],
      requiresAuth: true,
      title: '关于我们',
    },
    name: '关于我们',
    path: '/about',
  },
] as RouteRecordRaw[]
