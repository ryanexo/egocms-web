import type { Component } from 'vue'

export type ConfirmBehavior = 'cancel' | 'close' | 'confirm'

export interface ConfirmOptions {
  title?: Component | string
  type: ConfirmTheme
}

export type ConfirmTheme = 'danger' | 'default' | 'info' | 'success' | 'warning'

export interface ConfirmDialogResult {
  close: () => void
  result: Promise<ConfirmBehavior>
}
