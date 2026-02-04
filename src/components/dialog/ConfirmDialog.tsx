import type { TNode } from 'tdesign-vue-next'
import type { Slots } from 'vue'

import { Dialog } from 'tdesign-vue-next'
import { createApp, defineComponent, h, ref } from 'vue'

import type {
  ConfirmBehavior,
  ConfirmDialogResult,
  ConfirmOptions,
} from '@/components/dialog/types/ConfirmDialogTypes'

import { useResolver } from '@/utils/promise.ts'

export function openConfirmDialog(
  content: string | TNode,
  options?: ConfirmOptions,
): ConfirmDialogResult {
  const { promise, resolve } = useResolver<ConfirmBehavior>()
  const { promise: closedSignal, resolve: notifyClosed } = useResolver<void>()

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
        const slots: Slots = {
          default: () => [h(content)],
          header: () => [h(options?.title || '提示')],
        }

        return (
          <Dialog
            closeOnEscKeydown={options?.closeOnEscKeydown}
            closeOnOverlayClick={options?.closeOnOverlayClick}
            confirmOnEnter={options?.confirmOnEnter}
            onCancel={handleCancel}
            onCloseBtnClick={handleClose}
            onClosed={notifyClosed}
            onConfirm={handleConfirm}
            onUpdate:visible={setVisible}
            preventScrollThrough={options?.preventScrollThrough}
            showOverlay={options?.showOverlay}
            visible={visible.value}
          >
            {slots}
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
