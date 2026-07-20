import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getMenuList } from '@api/modules/menu'
import { getComponent } from '@router/componentMap'

export const usePermissionStore = defineStore('permission', () => {
  const roles = ref([])
  const permissions = ref([])
  const menuList = ref([])
  const tagList = ref([
    { path: '/dashboard', title: '首页' }
  ])
  const cachedViews = ref([])
  const routesGenerated = ref(false)

  const hasPermission = (routeRoles) => {
    if (!routeRoles || routeRoles.length === 0) {
      return true
    }
    return routeRoles.some(role => roles.value.includes(role))
  }

  const filterMenuByRole = (menuList) => {
    const filtered = []
    menuList.forEach(menu => {
      if (hasPermission(menu.meta?.roles)) {
        const item = { ...menu }
        if (item.children && item.children.length > 0) {
          item.children = filterMenuByRole(item.children)
        }
        filtered.push(item)
      }
    })
    return filtered
  }

  const menuToRoute = (menu) => {
    const route = {
      path: menu.path,
      name: menu.name,
      component: getComponent(menu.component),
      meta: {
        ...menu.meta,
        title: menu.meta?.title,
        icon: menu.meta?.icon,
        roles: menu.meta?.roles,
        hidden: menu.meta?.hidden || false,
        keepAlive: menu.meta?.keepAlive || false,
        badge: menu.meta?.badge
      }
    }

    if (menu.children && menu.children.length > 0) {
      route.children = menu.children.map(child => menuToRoute(child))
    }

    return route
  }

  const generateRoutes = async (userRoles) => {
    roles.value = userRoles
    permissions.value = generatePermissions(userRoles)

    if (!routesGenerated.value) {
      const menuRes = await getMenuList()
      const rawMenus = menuRes.data || []
      const accessibleMenus = filterMenuByRole(rawMenus)
      menuList.value = accessibleMenus
      routesGenerated.value = true
    }

    const routes = menuList.value.map(menu => menuToRoute(menu))

    const cachedComponents = menuList.value.flatMap(menu => {
      const items = []
      if (menu.meta?.keepAlive && menu.name) {
        items.push(menu.name)
      }
      if (menu.children) {
        menu.children.forEach(child => {
          if (child.meta?.keepAlive && child.name) {
            items.push(child.name)
          }
        })
      }
      return items
    })
    cachedViews.value = [...new Set(cachedComponents)]

    return routes
  }

  const generatePermissions = (userRoles) => {
    const permissionMap = {
      admin: ['user:list', 'user:add', 'user:edit', 'user:delete', 'settings:view', 'settings:edit', 'order:list', 'order:add', 'order:edit', 'order:delete', 'analytics:view'],
      user: ['user:profile', 'order:list'],
      guest: []
    }

    const perms = []
    userRoles.forEach(role => {
      if (permissionMap[role]) {
        perms.push(...permissionMap[role])
      }
    })
    return [...new Set(perms)]
  }

  const addTag = (path, title) => {
    if (!path || !title) return
    const exists = tagList.value.some(tag => tag.path === path)
    if (!exists) {
      tagList.value.push({ path, title })
    }
  }

  const removeTag = (path) => {
    const index = tagList.value.findIndex(tag => tag.path === path)
    if (index > 0) {
      tagList.value.splice(index, 1)
    }
  }

  const clearTags = () => {
    tagList.value = [{ path: '/dashboard', title: '首页' }]
  }

  const resetPermission = () => {
    roles.value = []
    permissions.value = []
    menuList.value = []
    cachedViews.value = []
    routesGenerated.value = false
    clearTags()
  }

  return {
    roles,
    permissions,
    menuList,
    tagList,
    cachedViews,
    routesGenerated,
    hasPermission,
    generateRoutes,
    addTag,
    removeTag,
    clearTags,
    resetPermission
  }
})