import { usePermissionStore } from '@store/modules/permission'

export const permission = {
  mounted(el, binding) {
    const { value, arg } = binding
    if (!value) return

    const permissionStore = usePermissionStore()
    const permissions = permissionStore.permissions
    const roles = permissionStore.roles

    if (arg === 'role') {
      handleRolePermission(el, value, roles)
    } else {
      handlePermission(el, value, permissions)
    }
  },
  updated(el, binding) {
    const { value, arg } = binding
    if (!value) return

    const permissionStore = usePermissionStore()
    const permissions = permissionStore.permissions
    const roles = permissionStore.roles

    if (arg === 'role') {
      handleRolePermission(el, value, roles)
    } else {
      handlePermission(el, value, permissions)
    }
  }
}

const handlePermission = (el, value, permissions) => {
  let hasPermission = false
  
  if (typeof value === 'string') {
    hasPermission = permissions.includes(value)
  } else if (Array.isArray(value)) {
    hasPermission = value.some(perm => permissions.includes(perm))
  }
  
  if (!hasPermission) {
    el.style.display = 'none'
  } else {
    el.style.display = ''
  }
}

const handleRolePermission = (el, value, roles) => {
  let hasRole = false
  
  if (typeof value === 'string') {
    hasRole = roles.includes(value)
  } else if (Array.isArray(value)) {
    hasRole = value.some(role => roles.includes(role))
  }
  
  if (!hasRole) {
    el.style.display = 'none'
  } else {
    el.style.display = ''
  }
}