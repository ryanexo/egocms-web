import type { Composer } from 'vue-i18n'

import { createI18n } from 'vue-i18n'

import { useLocaleSetter } from '@/locales/services/locale-loader.service.ts'

function createAppI18n() {
  const i18n = createI18n({ legacy: false })
  const setter = useLocaleSetter(i18n.global)

  const setLocale = (locale: string) => setter.setLocale(locale)
  const restoreLocale = (fallback: string) => setter.restoreLocale(fallback)

  return { i18n, restoreLocale, setLocale }
}

export const { i18n, restoreLocale, setLocale } = createAppI18n()
export const trans: Composer['t'] = i18n.global.t.bind(i18n.global)
