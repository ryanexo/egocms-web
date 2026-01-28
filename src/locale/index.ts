import { createI18n } from 'vue-i18n'

import { useLocaleSetter } from '@/locale/services/locale-loader.service.ts'

function createAppI18n() {
  const loader = useLocaleSetter()
  const i18n = createI18n({ legacy: false })
  const setLocale = (locale: string) => loader.setLocale(i18n.global, locale)

  return { i18n, setLocale }
}

export const { i18n, setLocale } = createAppI18n()
