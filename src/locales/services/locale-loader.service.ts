import type { Composer } from 'vue-i18n'

import { castArray } from 'es-toolkit/compat'
import { nextTick } from 'vue'

import type { LocaleSetter } from '@/locales/types/service'
import type {
  TranslationRegistry,
  Translations,
  TranslationSource,
} from '@/locales/types/translations'

import { appStorage } from '@/core/storage'
import { StorageKey } from '@/core/storage/constants.ts'

function loadLocaleFiles() {
  const files = import.meta.glob('../translations/**/*.json')
  const importsCtx: TranslationRegistry = {}

  Object.entries(files).forEach((entry) => {
    const path = entry[0] as string
    const importFn = entry[1] as ImportFn<Translations>
    const matches = path
      .substring('../translations/'.length)
      .match(/^(?<locale>[a-z]+-[A-Z]+)\/(?<namespace>[a-zA-Z-_]+)\.json$/)
    const locale = matches?.groups?.locale
    const namespace = matches?.groups?.namespace
    if (locale && namespace) {
      if (!Array.isArray(importsCtx[locale])) {
        importsCtx[locale] = []
      }
      importsCtx[locale]?.push(convertToAsyncTranslations(namespace, importFn))
    }
  })

  return importsCtx
}

function convertToAsyncTranslations(ns: string, importFn: ImportFn<Translations>) {
  return async () => {
    const translations: Translations = {}
    const result = await importFn()
    if (result.default) {
      translations[ns] = result.default
    }
    return translations
  }
}

async function loadTranslations(
  source: TranslationSource | TranslationSource[],
): Promise<Translations> {
  const translations: Translations = {}

  const result = await Promise.all(
    castArray<TranslationSource>(source).map((t) => {
      if (typeof t === 'function') {
        return t()
      }
      return Promise.resolve(t)
    }),
  )

  result.forEach((t) => Object.assign(translations, t))

  return translations
}

function useLocaleSetter(composer: Composer): LocaleSetter {
  const locales = loadLocaleFiles()
  const loaded = new Set<string>()

  const isValidLocale = (locale: any) => Reflect.has(locales, locale)

  const setLocale: LocaleSetter['setLocale'] = async (locale, fallback) => {
    if (loaded.has(locale)) {
      return true
    }
    if (!isValidLocale(locale)) {
      return false
    }

    const source = locales[locale] as TranslationSource[]
    const translations = await loadTranslations(source)
    composer.setLocaleMessage(locale, translations)
    composer.locale.value = locale
    appStorage.set(StorageKey.Locale, locale)

    if (fallback) {
      composer.fallbackLocale.value = locale
    }

    return nextTick().then(() => true)
  }
  const restoreLocale: LocaleSetter['restoreLocale'] = async (fallback) => {
    const locale = appStorage.get('locale')
    const success = isValidLocale(locale) && (await setLocale(locale))
    if (success) {
      return true
    }
    return setLocale(fallback)
  }

  return { restoreLocale, setLocale }
}

export { useLocaleSetter }
