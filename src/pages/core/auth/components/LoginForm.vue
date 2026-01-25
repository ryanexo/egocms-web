<script setup lang="ts">
import { SecuredIcon, User1Icon } from 'tdesign-icons-vue-next'
import { h, ref } from 'vue'

import type { SchemaFormProps } from '@/components/form/types/schema-form'

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

const data = ref({})
</script>

<template>
  <schema-form
    :data="data"
    :elements="formOptions"
  />
</template>

<style scoped></style>
