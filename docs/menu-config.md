# 菜单配置文档

## 概述

本系统支持从后端动态获取菜单配置，实现运营人员可在后台配置菜单，无需修改代码即可新增页面和菜单。

## 菜单数据结构

### 基础字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | Number | 是 | 菜单唯一标识 |
| path | String | 是 | 路由路径 |
| name | String | 是 | 路由名称（用于keep-alive缓存） |
| component | String | 是 | 组件路径（相对于@views） |
| meta | Object | 是 | 菜单元信息 |
| children | Array | 否 | 子菜单列表 |

### meta 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | String | 是 | 菜单显示名称 |
| icon | String | 否 | 图标名称（参考图标映射表） |
| roles | Array | 否 | 可见角色列表，为空则所有角色可见 |
| hidden | Boolean | 否 | 是否隐藏（默认false） |
| keepAlive | Boolean | 否 | 是否缓存（默认false） |
| badge | Number | 否 | 徽标数字（未读消息数） |

### 图标映射表

| 图标名称 | Element Plus 图标 | 说明 |
|----------|-------------------|------|
| Home | HomeFilled | 首页/仪表盘 |
| User | User | 用户 |
| Setting | Setting | 设置 |
| List | Document | 列表 |
| Plus | Document | 添加 |
| Lock | Lock | 权限/安全 |
| PieChart | PieChart | 图表/数据 |

## 配置示例

### 一级菜单（无子菜单）

```json
{
  "id": 1,
  "path": "dashboard",
  "name": "Dashboard",
  "component": "dashboard/index",
  "meta": {
    "title": "仪表盘",
    "icon": "Home",
    "roles": ["admin", "user", "guest"],
    "hidden": false,
    "keepAlive": true
  },
  "children": []
}
```

### 二级菜单（有子菜单）

```json
{
  "id": 2,
  "path": "user",
  "name": "User",
  "component": "layout/Container",
  "meta": {
    "title": "用户管理",
    "icon": "User",
    "roles": ["admin"],
    "hidden": false,
    "keepAlive": false
  },
  "children": [
    {
      "id": 21,
      "path": "user/list",
      "name": "UserList",
      "component": "user/list",
      "meta": {
        "title": "用户列表",
        "icon": "List",
        "roles": ["admin"],
        "hidden": false,
        "keepAlive": true
      },
      "children": []
    },
    {
      "id": 22,
      "path": "user/add",
      "name": "UserAdd",
      "component": "user/add",
      "meta": {
        "title": "添加用户",
        "icon": "Plus",
        "roles": ["admin"],
        "hidden": false,
        "keepAlive": false
      },
      "children": []
    }
  ]
}
```

### 带徽标的菜单

```json
{
  "id": 4,
  "path": "order",
  "name": "Order",
  "component": "layout/Container",
  "meta": {
    "title": "订单管理",
    "icon": "List",
    "roles": ["admin", "user"],
    "hidden": false,
    "keepAlive": false,
    "badge": 12
  },
  "children": []
}
```

## 组件路径说明

组件路径相对于 `src/views/` 目录，使用 `/` 分隔，不带 `.vue` 后缀。

| 组件路径 | 实际文件 |
|----------|----------|
| `dashboard/index` | `src/views/dashboard/index.vue` |
| `user/list` | `src/views/user/list.vue` |
| `settings/system` | `src/views/settings/system.vue` |
| `layout/Container` | `src/layout/Container.vue` |

## 新增页面流程

### 1. 创建页面组件

```bash
mkdir -p src/views/new-page
touch src/views/new-page/index.vue
```

### 2. 注册组件映射

编辑 `src/router/componentMap.js`：

```javascript
const componentMap = {
  // ... 已有配置
  'new-page/index': () => import('@views/new-page/index.vue')
}
```

### 3. 配置菜单

在后端菜单管理系统中添加配置，或修改 `src/api/modules/menu.js` 中的 mock 数据：

```json
{
  "id": 100,
  "path": "new-page",
  "name": "NewPage",
  "component": "new-page/index",
  "meta": {
    "title": "新页面",
    "icon": "List",
    "roles": ["admin"],
    "hidden": false,
    "keepAlive": true
  },
  "children": []
}
```

### 4. 无需重新部署

登录系统后自动获取最新菜单配置，动态生成路由。

## 权限控制

### 角色定义

| 角色 | 说明 | 权限示例 |
|------|------|----------|
| admin | 管理员 | 所有权限 |
| user | 普通用户 | 部分权限 |
| guest | 访客 | 只读权限 |

### 权限点定义

| 权限点 | 说明 |
|--------|------|
| user:list | 用户列表 |
| user:add | 添加用户 |
| user:edit | 编辑用户 |
| user:delete | 删除用户 |
| user:profile | 个人中心 |
| settings:view | 查看设置 |
| settings:edit | 编辑设置 |
| order:list | 订单列表 |
| order:add | 添加订单 |
| order:edit | 编辑订单 |
| order:delete | 删除订单 |
| analytics:view | 数据分析 |

### 按钮权限使用

```vue
<template>
  <el-button v-permission="'user:add'">添加用户</el-button>
  <el-button v-permission="'user:edit'">编辑</el-button>
  <el-button v-permission="'user:delete'" type="danger">删除</el-button>
</template>
```

## 路由缓存

通过 `meta.keepAlive` 控制页面是否缓存：

- `keepAlive: true`：页面切换时保留状态
- `keepAlive: false`：每次进入重新渲染

缓存的页面会被加入 `keep-alive` 的 `include` 列表，基于路由名称（`name`）进行匹配。

## 动态路由流程

```
用户登录 → 获取用户信息 → 获取菜单配置 → 过滤权限菜单 → 生成路由对象 → 添加到路由 → 跳转首页
```

### 关键代码位置

| 文件 | 功能 |
|------|------|
| `src/api/modules/menu.js` | 菜单配置API |
| `src/store/modules/permission.js` | 权限状态管理、路由生成 |
| `src/router/guard.js` | 路由守卫、动态路由添加 |
| `src/router/componentMap.js` | 组件路径映射 |
| `src/layout/Sidebar.vue` | 侧边栏菜单渲染 |

## 注意事项

1. **路由名称唯一性**：`name` 字段必须唯一，用于 keep-alive 缓存匹配
2. **组件路径正确性**：必须在 `componentMap` 中注册对应的组件路径
3. **权限一致性**：`meta.roles` 需要与后端权限系统保持一致
4. **子菜单路径**：子菜单的 `path` 应包含父级路径（如 `user/list`）
5. **容器组件**：包含子菜单的父级菜单需使用 `layout/Container` 组件