import { computed } from 'vue'
import { usePermissionStore } from '@/store/modules/permission'

export const usePermission = () => {
  const permissionStore = usePermissionStore()

  const hasPermission = (permission) => {
    const permissions = permissionStore.permissions
    return permissions.includes(permission)
  }

  const hasRole = (role) => {
    const roles = permissionStore.roles
    return roles.includes(role)
  }

  const hasAnyRole = (roles) => {
    const userRoles = permissionStore.roles
    return roles.some(role => userRoles.includes(role))
  }

  const hasAllRoles = (roles) => {
    const userRoles = permissionStore.roles
    return roles.every(role => userRoles.includes(role))
  }

  const isAdmin = computed(() => {
    return hasRole('admin') || hasRole('super_admin')
  })

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin
  }
}