import { nextTick } from 'vue'

import type { Translations } from '@/locale/types/translations'
import type { LocaleSetter } from '@/locale/types/translator'

function loadLocaleFiles() {
  const files = import.meta.glob('../translations/*.ts')
  const translations: Record<string, () => Promise<Translations>> = {}

  Object.entries(files).forEach(([path, importFn]) => {
    const matches = path.substring('./translations/'.length).match(/^(?<name>[a-z]+-[A-Z]+)\.ts/)
    const name = matches?.groups?.name
    if (name) {
      translations[name] = async () => {
        const content = await importFn()
        const data = content as { default: Translations }
        return data.default
      }
    }
  })

  return translations
}

function useLocaleSetter(): LocaleSetter {
  const locales = loadLocaleFiles()
  const loaded = new Set<string>()

  const setLocale: LocaleSetter['setLocale'] = async (composer, locale, fallback) => {
    if (loaded.has(locale) || !Reflect.has(locales, locale)) {
      return
    }

    const translations = await (locales[locale]?.() as Promise<Translations>)
    composer.setLocaleMessage(locale, translations)
    composer.locale.value = locale

    if (fallback) {
      composer.fallbackLocale.value = locale
    }

    return nextTick()
  }

  return { setLocale }
}

export { useLocaleSetter }
