import NProgress from 'nprogress'

import type { IProgressService } from '@/services/types/progress.service'

export function createProgressService(
  options?: Partial<NProgress.NProgressOptions>,
): IProgressService {
  if (options) {
    NProgress.configure(options)
  }

  const start = () => {
    NProgress.start()
  }
  const done = () => {
    NProgress.done()
  }

  return { done, start }
}
