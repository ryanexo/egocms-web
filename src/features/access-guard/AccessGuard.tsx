import type { PropType } from 'vue'

import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import type { AccessGuardProps } from '@/features/access-guard/types/access-guard'

import { useAuthStore } from '@/stores'

const AccessGuard = defineComponent({
  name: 'PermWrapper',
  props: {
    perm: {
      required: true,
      type: [String, Array] as PropType<AccessGuardProps['perm']>,
    },
    requireAll: {
      default: true,
      type: Boolean as PropType<AccessGuardProps['requireAll']>,
    },
    /**
     * 权限作用域，通常是路由path，默认为通用作用域(path = '/')
     */
    scope: {
      default: '/',
      type: String as PropType<AccessGuardProps['scope']>,
    },
  },
  setup(props: AccessGuardProps, { slots }) {
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

export { AccessGuard as default }
