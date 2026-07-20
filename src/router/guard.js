import { useUserStore } from '@store/modules/user'
import { usePermissionStore } from '@store/modules/permission'

export const setupGuards = (router) => {
  router.beforeEach(async (to, from) => {
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    const hasToken = localStorage.getItem('token')

    if (to.path === '/login') {
      if (hasToken) {
        return { path: '/dashboard' }
      }
      return true
    }

    if (!hasToken) {
      return { path: '/login' }
    }

    if (!userStore.user.name) {
      await userStore.getUserInfo()
    }

    if (permissionStore.menuList.length === 0) {
      await permissionStore.generateRoutes(userStore.user.roles)
    }

    const hasPermission = permissionStore.hasPermission(to.meta.roles || [])
    if (hasPermission) {
      return true
    }

    return { path: '/404' }
  })

  router.afterEach((to) => {
    if (to.meta.title) {
      document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}`
    }

    const permissionStore = usePermissionStore()
    if (to.meta.title && !to.meta.hidden) {
      permissionStore.addTag(to.path, to.meta.title)
    }
  })

  router.onError((error) => {
    console.error('Router error:', error)
  })
}