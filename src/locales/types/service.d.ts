export interface LocaleSetter {
  restoreLocale(fallback: string): Promise<boolean>
  setLocale(locale: string, fallback?: boolean): Promise<boolean>
}
