<script setup lang="ts">
import { LoginIcon, SecuredIcon, User1Icon, UserAddIcon } from 'tdesign-icons-vue-next'
import { h, ref } from 'vue'

import type { ButtonGroupProps } from '@/components/button/types/button-group'
import type { SchemaFormProps } from '@/components/form/types/schema-form'

import ButtonGroup from '@/components/button/ButtonGroup.tsx'
import SchemaForm from '@/components/form/SchemaForm.tsx'

const formOptions: SchemaFormProps['elements'] = [
  {
    fieldKey: 'username',
    meta: { status: 'error' },
    props: {
      label: () => {
        return h(
          'span',
          { class: 'inline-flex justify-center items-center gap-x-1' },
          {
            default: () => [h(User1Icon), h('span', '用户名')],
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
          { class: 'inline-flex justify-center items-center gap-x-1' },
          {
            default: () => [h(SecuredIcon), h('span', '密　码')],
          },
        )
      },
      placeholder: '请输入密码',
    },
    type: 'input',
  },
]

const buttons: ButtonGroupProps['buttons'] = [
  { icon: (h) => h(LoginIcon), id: 'login', text: '登录' },
  { icon: (h) => h(UserAddIcon), id: 'register', text: '注册', theme: 'default' },
]

const data = ref({})
</script>

<template>
  <div class="flex flex-col items-center gap-y-6">
    <schema-form
      size="large"
      :data="data"
      :elements="formOptions"
    />
    <button-group
      size="large"
      :buttons="buttons"
      :gap="6"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.button-group) {
  width: 100%;
}
:deep(.t-button) {
  width: 50%;
}
</style>
