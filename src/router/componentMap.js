const componentMap = {
  'dashboard/index': () => import('@views/dashboard/index.vue'),
  'user/list': () => import('@views/user/list.vue'),
  'user/add': () => import('@views/user/add.vue'),
  'user/profile': () => import('@views/user/profile.vue'),
  'settings/system': () => import('@views/settings/system.vue'),
  'settings/permission': () => import('@views/settings/permission.vue'),
  'order/list': () => import('@views/order/list.vue'),
  'order/detail': () => import('@views/order/detail.vue'),
  'analytics/report': () => import('@views/analytics/report.vue'),
  'analytics/chart': () => import('@views/analytics/chart.vue'),
  'layout/Container': () => import('@layout/Container.vue')
}

export const getComponent = (componentPath) => {
  return componentMap[componentPath] || (() => import('@views/error/404.vue'))
}

export default componentMap