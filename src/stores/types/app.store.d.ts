export interface AppStoreState {
  pageTitle: string
}

export interface AppUpdater {
  cancel(): void
  confirm(): Promise<boolean>
  getUpdateFrequencySeconds(): number
  isLatestVersion(signal: AbortSignal): Promise<boolean>
}
