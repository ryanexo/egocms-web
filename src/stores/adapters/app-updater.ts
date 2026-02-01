import dayjs from 'dayjs'

import type { AppUpdater } from '@/stores/types/app'

import { openConfirmDialog } from '@/components/dialog/ConfirmDialog.tsx'
import { httpClient } from '@/core/http-client'
import { trans } from '@/locales'

/**
 * @param {number} interval 更新检查间隔(单位:秒)，默认10秒
 * @returns {AppUpdater}
 */
export function useAppUpdater(interval: number = 10): AppUpdater {
  const zeroDate = dayjs('1970-01-01')
  let currentVersion = zeroDate
  let dialogCloser: Callable | undefined = undefined

  const confirm: AppUpdater['confirm'] = async () => {
    const prompt = openConfirmDialog(trans('common.app.updater.confirm'), {
      closeOnEscKeydown: false,
      closeOnOverlayClick: false,
      title: trans('common.app.update.content'),
      type: 'warning',
    })
    dialogCloser = prompt.close

    return (await prompt.result) === 'confirm'
  }
  const cancel: AppUpdater['cancel'] = () => dialogCloser?.()
  const getUpdateFrequencySeconds: AppUpdater['getUpdateFrequencySeconds'] = () => interval
  const isLatestVersion = async (signal: AbortSignal) => {
    const latestModified = await httpClient
      .head('/', { baseURL: '', signal })
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
