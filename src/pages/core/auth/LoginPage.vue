<script setup lang="ts">
import dayjs from 'dayjs'
import {
  LoginIcon,
  RocketFilledIcon,
  SecuredIcon,
  User1Icon,
  UserAddIcon,
} from 'tdesign-icons-vue-next'
import { h, ref } from 'vue'

import type { UserCredentialParams } from '@/api/user/types'
import type { ButtonGroupProps } from '@/components/button/types/button-group'
import type { SchemaFormProps } from '@/components/form/types/schema-form'

import ButtonGroup from '@/components/button/ButtonGroup.tsx'
import SchemaForm from '@/components/form/SchemaForm.tsx'

const year = dayjs().format('YYYY')
const copyright = `Copyright©${year}`

const formData = ref<Partial<UserCredentialParams>>({})
const formOptions: SchemaFormProps<UserCredentialParams>['options'] = [
  {
    fieldKey: 'username',
    meta: { status: 'error' },
    props: {
      label: () => {
        return h(
          'span',
          { class: 'inline-flex justify-center items-center gap-x-1 text-gray-500' },
          {
            default: () => [h(User1Icon)],
          },
        )
      },
      placeholder: '请输入用户名',
    },
    rules: [{ required: true }],
    type: 'input',
  },
  {
    fieldKey: 'password',
    props: {
      label: () => {
        return h(
          'span',
          { class: 'inline-flex justify-center items-center gap-x-1 text-gray-500' },
          {
            default: () => [h(SecuredIcon)],
          },
        )
      },
      placeholder: '请输入密码',
    },
    type: 'input',
  },
]

const actions: ButtonGroupProps['actions'] = [
  { icon: (h) => h(LoginIcon), id: 'login', text: '登录' },
  {
    icon: (h) => h(UserAddIcon),
    id: 'register',
    text: '注册',
    theme: 'default',
  },
]
</script>

<template>
  <div class="bg-primary flex h-16 w-16 items-center justify-center rounded-2xl">
    <rocket-filled-icon
      size="32px"
      fill-color="#fff"
    />
  </div>

  <div class="flex flex-col gap-y-2 text-center">
    <h1 class="text-3xl">欢迎回来</h1>
    <h3 class="text-gray-500">请登录您的账户继续</h3>
  </div>

  <div class="login mt-4 max-w-lg">
    <div class="flex flex-col items-center gap-y-6">
      <schema-form
        :data="formData"
        :options="formOptions"
        :responsive="{ gap: 4 }"
      />
      <button-group
        class="flex-wrap md:flex-nowrap"
        :actions="actions"
        :gap="4"
      />
    </div>
  </div>

  <div class="text-center text-xs text-gray-500">
    <span>{{ copyright }}</span>
  </div>
</template>

<style scoped lang="scss">
.login {
  --td-bg-color-specialcomponent: var(--color-gray-100);
  --td-border-level-2-color: var(--color-gray-200);
}
:deep(.button-group) {
  width: 100%;
}
:deep(.t-button) {
  width: 100%;
}
</style>
