import type { PropType } from 'vue'

import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import type { PermWrapperProps } from '@/features/permission/types/perm-wrapper'

import { useAuthStore } from '@/stores'

const PermWrapper = defineComponent({
  name: 'PermWrapper',
  props: {
    perm: {
      required: true,
      type: [String, Array] as PropType<PermWrapperProps['perm']>,
    },
    requireAll: {
      default: true,
      type: Boolean as PropType<PermWrapperProps['requireAll']>,
    },
    /**
     * 权限作用域，通常是路由path，默认为通用作用域(path = '/')
     */
    scope: {
      default: '/',
      type: String as PropType<PermWrapperProps['scope']>,
    },
  },
  setup(props, { slots }) {
    const currentRoute = useRouter().currentRoute
    const authStore = useAuthStore()
    const scope = computed(() => (props.scope === '/' ? props.scope : currentRoute.value.path))

    return () => {
      if (authStore.isAuthorized(scope.value, props.perm, props.requireAll)) {
        return <>{slots?.default?.()}</>
      }

      return <></>
    }
  },
})

export { PermWrapper as default }
