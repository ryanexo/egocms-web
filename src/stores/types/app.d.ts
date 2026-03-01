export interface AppStoreState {
  pageTitle: string
  sidebarCollapsed: boolean
}

export interface AppUpdater {
  cancel(): void
  confirm(): Promise<boolean>
  getUpdateFrequencySeconds(): number
  isLatestVersion(signal: AbortSignal): Promise<boolean>
}
