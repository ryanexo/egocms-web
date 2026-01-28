export interface Translations {
  [key: string]: string | Translations
}

export type TranslationSource = (() => Promise<Translations>) | Translations

export type TranslationRegistry = Record<string, TranslationSource[]>
