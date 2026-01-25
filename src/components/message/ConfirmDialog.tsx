import type { Component } from 'vue'

import { Dialog } from 'tdesign-vue-next'
import { createApp, defineComponent, ref } from 'vue'

import type {
  ConfirmBehavior,
  ConfirmDialogResult,
  ConfirmOptions,
} from '@/components/message/types/ConfirmDialogTypes'

import { createPromiseWithResolver } from '@/utils/promise.ts'

export function openConfirmDialog(
  content: Component | string,
  options?: ConfirmOptions,
): ConfirmDialogResult {
  const { promise, resolve } = createPromiseWithResolver<ConfirmBehavior>()
  const { promise: closedSignal, resolve: notifyClosed } =
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    createPromiseWithResolver<void>()

  const RootComponent = defineComponent({
    setup() {
      const visible = ref(true)

      function setVisible(val: boolean) {
        visible.value = val
      }
      function handleConfirm() {
        setVisible(false)
        resolve('confirm')
      }
      function handleClose() {
        setVisible(false)
        resolve('close')
      }
      function handleCancel() {
        setVisible(false)
        resolve('cancel')
      }

      return () => {
        return (
          <Dialog
            onCancel={handleCancel}
            onCloseBtnClick={handleClose}
            onClosed={notifyClosed}
            onConfirm={handleConfirm}
            onUpdate:visible={setVisible}
            visible={visible.value}
          >
            {{
              default: () => content,
              header: () => options?.title || '提示',
            }}
          </Dialog>
        )
      }
    },
  })

  const app = createApp(RootComponent)
  const el = document.createElement('div')

  app.mount(el)
  document.body.appendChild(el)
  closedSignal.then(() => {
    app.unmount()
    el.remove()
  })

  return { close: () => resolve('close'), result: promise }
}
