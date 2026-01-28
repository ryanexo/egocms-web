import type { Composer } from 'vue-i18n'

export interface LocaleSetter {
  setLocale(composer: Composer, locale: string, fallback?: boolean): Promise<void>
}
