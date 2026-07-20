export default [
  {
    id: 1,
    path: 'dashboard',
    name: 'Dashboard',
    component: 'dashboard/index',
    meta: {
      title: '仪表盘',
      icon: 'Home',
      roles: ['admin', 'user', 'guest'],
      hidden: false,
      keepAlive: true
    },
    children: []
  },
  {
    id: 2,
    path: 'user',
    name: 'User',
    component: 'layout/Container',
    meta: {
      title: '用户管理',
      icon: 'User',
      roles: ['admin'],
      hidden: false,
      keepAlive: false
    },
    children: [
      {
        id: 21,
        path: 'list',
        name: 'UserList',
        component: 'user/list',
        meta: { title: '用户列表', icon: 'Table', roles: ['admin'], hidden: false, keepAlive: true },
        children: []
      },
      {
        id: 22,
        path: 'add',
        name: 'UserAdd',
        component: 'user/add',
        meta: { title: '添加用户', icon: 'Form', roles: ['admin'], hidden: false, keepAlive: false },
        children: []
      },
      {
        id: 23,
        path: 'profile',
        name: 'Profile',
        component: 'user/profile',
        meta: { title: '个人中心', icon: 'User', roles: ['admin', 'user'], hidden: false, keepAlive: true, badge: 3 },
        children: []
      }
    ]
  },
  {
    id: 3,
    path: 'settings',
    name: 'Settings',
    component: 'layout/Container',
    meta: { title: '系统设置', icon: 'Setting', roles: ['admin'], hidden: false, keepAlive: false },
    children: [
      {
        id: 31,
        path: 'system',
        name: 'SystemSettings',
        component: 'settings/system',
        meta: { title: '系统配置', icon: 'Setting', roles: ['admin'], hidden: false, keepAlive: false },
        children: []
      },
      {
        id: 32,
        path: 'permission',
        name: 'PermissionSettings',
        component: 'settings/permission',
        meta: { title: '权限管理', icon: 'Lock', roles: ['admin'], hidden: false, keepAlive: false },
        children: []
      }
    ]
  },
  {
    id: 4,
    path: 'order',
    name: 'Order',
    component: 'layout/Container',
    meta: { title: '订单管理', icon: 'Document', roles: ['admin', 'user'], hidden: false, keepAlive: false, badge: 12 },
    children: [
      {
        id: 41,
        path: 'list',
        name: 'OrderList',
        component: 'order/list',
        meta: { title: '订单列表', icon: 'Table', roles: ['admin', 'user'], hidden: false, keepAlive: true, badge: 12 },
        children: []
      },
      {
        id: 42,
        path: 'detail',
        name: 'OrderDetail',
        component: 'order/detail',
        meta: { title: '订单详情', icon: 'Document', roles: ['admin', 'user'], hidden: false, keepAlive: false },
        children: []
      }
    ]
  },
  {
    id: 5,
    path: 'form',
    name: 'FormDemo',
    component: 'layout/Container',
    meta: { title: '表单生成器', icon: 'Form', roles: ['admin', 'user'], hidden: false, keepAlive: false },
    children: [
      {
        id: 51,
        path: 'demo',
        name: 'FormDemoPage',
        component: 'form-demo/index',
        meta: { title: '表单演示', icon: 'Form', roles: ['admin', 'user'], hidden: false, keepAlive: false },
        children: []
      }
    ]
  },
  {
    id: 6,
    path: 'analytics',
    name: 'Analytics',
    component: 'layout/Container',
    meta: { title: '数据分析', icon: 'DataAnalysis', roles: ['admin', 'user'], hidden: false, keepAlive: false },
    children: [
      {
        id: 61,
        path: 'report',
        name: 'AnalyticsReport',
        component: 'analytics/report',
        meta: { title: '数据报表', icon: 'Table', roles: ['admin'], hidden: false, keepAlive: true },
        children: []
      },
      {
        id: 62,
        path: 'chart',
        name: 'AnalyticsChart',
        component: 'analytics/chart',
        meta: { title: '可视化图表', icon: 'PieChart', roles: ['admin'], hidden: false, keepAlive: false },
        children: []
      },
      {
        id: 63,
        path: 'demo',
        name: 'ChartDemoPage',
        component: 'chart-demo/index',
        meta: { title: '图表演示', icon: 'Histogram', roles: ['admin', 'user'], hidden: false, keepAlive: false },
        children: []
      }
    ]
  }
]
