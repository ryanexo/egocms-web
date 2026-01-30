<script setup lang="ts">
import type { FormInstanceFunctions, SubmitContext } from 'tdesign-vue-next'

import dayjs from 'dayjs'
import {
  LockOnIcon,
  LoginIcon,
  RocketFilledIcon,
  User1Icon,
  UserAddIcon,
} from 'tdesign-icons-vue-next'
import { h, ref, useTemplateRef } from 'vue'

import type { UserCredentialParams } from '@/api/user/types/params'
import type {
  ButtonGroupClickContext,
  ButtonGroupProps,
} from '@/components/button/types/button-group'
import type { SchemaFormProps } from '@/components/form/types/schema-form'

import ButtonGroup from '@/components/button/ButtonGroup.tsx'
import SchemaForm from '@/components/form/SchemaForm.tsx'
import { trans } from '@/locales'
import { useAuthStore } from '@/stores'
import { useLoading } from '@/utils/loading.ts'

const year = dayjs().format('YYYY')
const copyright = `Copyright©${year}`

const form = useTemplateRef<FormInstanceFunctions>('form')
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
      placeholder: trans('auth.login.form.field.username.placeholder'),
    },
    rules: [
      {
        message: trans('validation.required', [trans('user.username')]),
        required: true,
        trigger: 'change',
      },
    ],
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
            default: () => [h(LockOnIcon)],
          },
        )
      },
      placeholder: trans('auth.login.form.field.password.placeholder'),
      type: 'password',
    },
    rules: [
      {
        message: trans('validation.required', [trans('user.password')]),
        required: true,
      },
    ],
    type: 'input',
  },
]

const actions: ButtonGroupProps['actions'] = [
  {
    block: true,
    icon: (h) => h(LoginIcon),
    id: 'login',
    text: trans('auth.login.actions.login'),
    type: 'submit',
  },
  {
    block: true,
    icon: (h) => h(UserAddIcon),
    id: 'forget',
    text: trans('auth.login.actions.forget'),
    theme: 'default',
  },
]

const loading = useLoading()
const authStore = useAuthStore()

function onFormSubmit({ validateResult }: SubmitContext<UserCredentialParams>) {
  if (validateResult === true) {
    authStore.authenticate(formData.value as Required<UserCredentialParams>)
  }
}
async function onButtonGroupClicked({ id }: ButtonGroupClickContext) {
  if (id === 'forget') {
    /* empty */
  }
}
</script>

<template>
  <div class="bg-primary flex h-16 w-16 items-center justify-center rounded-2xl">
    <rocket-filled-icon
      size="32px"
      fill-color="#fff"
    />
  </div>

  <div class="flex flex-col gap-y-2 text-center">
    <h1 class="text-3xl">{{ trans('auth.login.title') }}</h1>
    <h3 class="text-gray-500">{{ trans('auth.login.subtitle') }}</h3>
  </div>

  <div class="login mt-4 max-w-lg">
    <div class="flex flex-col items-center gap-y-6">
      <schema-form
        ref="form"
        :data="formData"
        :options="formOptions"
        :responsive="{ gap: 6 }"
        @submit="onFormSubmit"
      >
        <button-group
          class="flex-wrap md:flex-nowrap"
          :loading="loading.isLoading"
          :actions="actions"
          :gap="4"
          @click="onButtonGroupClicked"
        />
      </schema-form>
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
</style>
