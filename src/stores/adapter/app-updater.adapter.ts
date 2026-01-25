import dayjs from 'dayjs'

import type { AppUpdater } from '@/stores/types/app.store'

import { openConfirmDialog } from '@/components/message/ConfirmDialog.tsx'
import { httpClient } from '@/core/http-client/client.ts'

/**
 * @param {number} interval 更新检查间隔(单位:秒)，默认10秒
 * @returns {AppUpdater}
 */
export function useAppUpdater(interval: number = 10): AppUpdater {
  const zeroDate = dayjs('1970-01-01')
  let currentVersion = zeroDate
  let dialogCloser: Callable | undefined = undefined

  const confirm: AppUpdater['confirm'] = async () => {
    const prompt = openConfirmDialog('版本已更新，是否立即更新？', {
      title: '更新提示',
      type: 'warning',
    })
    dialogCloser = prompt.close

    return (await prompt.result) === 'confirm'
  }
  const cancel: AppUpdater['cancel'] = () => dialogCloser?.()
  const getUpdateFrequencySeconds: AppUpdater['getUpdateFrequencySeconds'] = () => interval
  const isLatestVersion = async (signal: AbortSignal) => {
    const latestModified = await httpClient
      .head('/', { signal })
      .then(({ headers }) =>
        headers['last-modified'] ? dayjs(headers['last-modified']) : zeroDate,
      )
      .catch(() => zeroDate)

    if (currentVersion.isSame(zeroDate)) {
      currentVersion = latestModified
      return true
    }

    return latestModified.isSame(currentVersion) || latestModified.isBefore(currentVersion)
  }

  return {
    cancel,
    confirm,
    getUpdateFrequencySeconds,
    isLatestVersion,
  }
}
