import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guard'

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@views/error/404.vue'),
    meta: { title: '404', hidden: true }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'Home', roles: ['admin', 'user', 'guest'], hidden: false, keepAlive: true }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@layout/Container.vue'),
        meta: { title: '用户管理', icon: 'User', roles: ['admin'], hidden: false, keepAlive: false },
        children: [
          {
            path: 'list',
            name: 'UserList',
            component: () => import('@views/user/list.vue'),
            meta: { title: '用户列表', icon: 'List', roles: ['admin'], hidden: false, keepAlive: true }
          },
          {
            path: 'add',
            name: 'UserAdd',
            component: () => import('@views/user/add.vue'),
            meta: { title: '添加用户', icon: 'Plus', roles: ['admin'], hidden: false, keepAlive: false }
          },
          {
            path: 'edit/:id',
            name: 'UserEdit',
            component: () => import('@views/user/edit.vue'),
            meta: { title: '编辑用户', icon: 'Edit', roles: ['admin'], hidden: true, keepAlive: false }
          },
          {
            path: 'profile',
            name: 'Profile',
            component: () => import('@views/user/profile.vue'),
            meta: { title: '个人中心', icon: 'User', roles: ['admin', 'user'], hidden: false, keepAlive: true, badge: 3 }
          }
        ]
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@layout/Container.vue'),
        meta: { title: '系统设置', icon: 'Setting', roles: ['admin'], hidden: false, keepAlive: false },
        children: [
          {
            path: 'system',
            name: 'SystemSettings',
            component: () => import('@views/settings/system.vue'),
            meta: { title: '系统配置', icon: 'Setting', roles: ['admin'], hidden: false, keepAlive: false }
          },
          {
            path: 'permission',
            name: 'PermissionSettings',
            component: () => import('@views/settings/permission.vue'),
            meta: { title: '权限管理', icon: 'Lock', roles: ['admin'], hidden: false, keepAlive: false }
          }
        ]
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@layout/Container.vue'),
        meta: { title: '订单管理', icon: 'List', roles: ['admin', 'user'], hidden: false, keepAlive: false, badge: 12 },
        children: [
          {
            path: 'list',
            name: 'OrderList',
            component: () => import('@views/order/list.vue'),
            meta: { title: '订单列表', icon: 'List', roles: ['admin', 'user'], hidden: false, keepAlive: true, badge: 12 }
          },
          {
            path: 'detail',
            name: 'OrderDetail',
            component: () => import('@views/order/detail.vue'),
            meta: { title: '订单详情', icon: 'Document', roles: ['admin', 'user'], hidden: false, keepAlive: false }
          }
        ]
      },
      {
        path: 'form',
        name: 'FormDemo',
        component: () => import('@layout/Container.vue'),
        meta: { title: '表单生成器', icon: 'Form', roles: ['admin', 'user'], hidden: false, keepAlive: false },
        children: [
          {
            path: 'demo',
            name: 'FormDemoPage',
            component: () => import('@views/form-demo/index.vue'),
            meta: { title: '表单演示', icon: 'Form', roles: ['admin', 'user'], hidden: false, keepAlive: false }
          }
        ]
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('@layout/Container.vue'),
        meta: { title: '数据分析', icon: 'DataAnalysis', roles: ['admin', 'user'], hidden: false, keepAlive: false },
        children: [
          {
            path: 'report',
            name: 'AnalyticsReport',
            component: () => import('@views/analytics/report.vue'),
            meta: { title: '数据报表', icon: 'Table', roles: ['admin'], hidden: false, keepAlive: true }
          },
          {
            path: 'chart',
            name: 'AnalyticsChart',
            component: () => import('@views/analytics/chart.vue'),
            meta: { title: '可视化图表', icon: 'PieChart', roles: ['admin'], hidden: false, keepAlive: false }
          },
          {
            path: 'demo',
            name: 'ChartDemoPage',
            component: () => import('@views/chart-demo/index.vue'),
            meta: { title: '图表演示', icon: 'Histogram', roles: ['admin', 'user'], hidden: false, keepAlive: false }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

setupGuards(router)

export default router