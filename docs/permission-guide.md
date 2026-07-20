# 权限控制文档

## 概述

本系统采用基于角色的访问控制（RBAC）模式，实现路由权限、按钮权限和数据权限的统一管理。

## 权限体系

### 角色定义

| 角色 | 标识 | 说明 |
|------|------|------|
| 管理员 | `admin` | 拥有所有权限，可管理系统配置和用户 |
| 普通用户 | `user` | 可访问个人中心和基础功能 |
| 访客 | `guest` | 仅可访问公开页面 |

### 权限点定义

| 权限点 | 说明 | 适用角色 |
|--------|------|----------|
| `user:list` | 查看用户列表 | admin |
| `user:add` | 添加用户 | admin |
| `user:edit` | 编辑用户 | admin |
| `user:delete` | 删除用户 | admin |
| `user:profile` | 个人中心 | admin, user |
| `settings:view` | 查看系统设置 | admin |
| `settings:edit` | 编辑系统设置 | admin |

---

## 路由权限控制

### 配置方式

在路由配置中通过 `meta.roles` 指定允许访问的角色：

```javascript
{
  path: '/user/list',
  name: 'UserList',
  component: () => import('@views/user/list.vue'),
  meta: { 
    title: '用户列表', 
    icon: 'List', 
    roles: ['admin']  // 仅管理员可访问
  }
}
```

### 工作流程

1. 用户登录后获取角色信息
2. 路由守卫拦截请求
3. 根据用户角色过滤动态路由
4. 动态添加有权限的路由

### 路由守卫

文件：`src/router/guard.js`

主要逻辑：
- 登录页直接放行
- 其他页面检查 Token
- 首次访问时根据角色生成路由
- 权限不足时跳转 404

---

## 按钮权限控制

### 使用方式

#### 权限点控制

```vue
<el-button v-permission="'user:add'">添加用户</el-button>
<el-button v-permission="['user:edit', 'user:delete']">编辑/删除</el-button>
```

#### 角色控制

```vue
<el-button v-permission:role="'admin'">管理员按钮</el-button>
<el-button v-permission:role="['admin', 'user']">多角色按钮</el-button>
```

### 指令实现

文件：`src/directive/permission.js`

支持两种模式：
- 默认模式：按权限点控制
- `:role` 参数：按角色控制

### 权限判断逻辑

```javascript
// 权限点判断
if (typeof value === 'string') {
  hasPermission = permissions.includes(value)
} else if (Array.isArray(value)) {
  hasPermission = value.some(perm => permissions.includes(perm))
}

// 角色判断
if (typeof value === 'string') {
  hasRole = roles.includes(value)
} else if (Array.isArray(value)) {
  hasRole = value.some(role => roles.includes(role))
}
```

---

## 数据权限控制

### 部门数据权限

通过用户信息中的 `department` 字段控制数据可见范围：

```javascript
import { useUserStore } from '@store/modules/user'

const userStore = useUserStore()
const userDepartment = userStore.user.department

// 仅获取本部门数据
const getDepartmentData = async () => {
  const data = await request.get('/api/data', {
    params: {
      department: userDepartment
    }
  })
  return data
}
```

---

## 权限 Store

文件：`src/store/modules/permission.js`

### 状态

| 状态 | 类型 | 说明 |
|------|------|------|
| `roles` | Array | 用户角色列表 |
| `permissions` | Array | 用户权限点列表 |
| `menuList` | Array | 有权限的菜单列表 |
| `tagList` | Array | 已打开的标签页列表 |

### 方法

| 方法 | 说明 |
|------|------|
| `generateRoutes(roles)` | 根据角色生成路由 |
| `hasPermission(routeRoles)` | 判断是否有路由权限 |
| `addTag(path, title)` | 添加标签页 |
| `removeTag(path)` | 移除标签页 |
| `clearTags()` | 清空标签页 |

---

## 用户信息存储

文件：`src/store/modules/user.js`

### 状态

| 状态 | 类型 | 说明 |
|------|------|------|
| `user.id` | String | 用户ID |
| `user.name` | String | 用户名称 |
| `user.avatar` | String | 用户头像 |
| `user.email` | String | 用户邮箱 |
| `user.roles` | Array | 用户角色 |
| `user.department` | String | 用户部门 |

### 方法

| 方法 | 说明 |
|------|------|
| `login(data)` | 用户登录 |
| `getUserInfo()` | 获取用户信息 |
| `logout()` | 用户退出 |
| `updateUserInfo(info)` | 更新用户信息 |

---

## Token 存储

文件：`src/utils/auth.js`

采用 `localStorage + Cookie` 双重存储策略：

| 方法 | 说明 |
|------|------|
| `setToken(token, expires)` | 设置Token（7天过期） |
| `getToken()` | 获取Token |
| `removeToken()` | 删除Token |
| `setUser(user)` | 设置用户信息 |
| `getUser()` | 获取用户信息 |
| `removeUser()` | 删除用户信息 |
| `saveRememberUser(username, password)` | 保存记住密码 |
| `isAuthenticated()` | 判断是否已认证 |

---

## 登录流程

```
用户输入账号密码 → 表单验证 → 验证码验证 → 调用登录接口
    → 成功: 存储Token和用户信息 → 跳转首页
    → 失败: 提示错误信息 → 刷新验证码
```

### Mock 登录测试

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | 123456 | admin |

---

## 退出登录

调用 `userStore.logout()` 方法，执行以下操作：
1. 调用退出接口
2. 清空用户信息
3. 删除 Token
4. 清空记住密码
5. 清空标签页
6. 跳转到登录页

---

## 使用示例

### 页面权限控制

```vue
<!-- 用户列表页 - 仅管理员可见 -->
<template>
  <div>
    <el-button v-permission="'user:add'">添加用户</el-button>
    <el-table>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button v-permission="'user:edit'">编辑</el-button>
          <el-button v-permission="'user:delete'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
```

### 动态菜单生成

```vue
<!-- Sidebar.vue -->
<template>
  <el-menu :default-active="activeMenu" mode="vertical">
    <template v-for="menu in permissionStore.menuList" :key="menu.path">
      <el-sub-menu v-if="menu.children" :index="menu.path">
        <template #title>
          <el-icon><component :is="getIcon(menu.icon)" /></el-icon>
          <span>{{ menu.meta.title }}</span>
        </template>
        <el-menu-item v-for="child in menu.children" :key="child.path" :index="child.path">
          {{ child.meta.title }}
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :index="menu.path">
        <el-icon><component :is="getIcon(menu.icon)" /></el-icon>
        <span>{{ menu.meta.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { usePermissionStore } from '@store/modules/permission'

const permissionStore = usePermissionStore()
</script>
```

---

## 企业场景扩展

### 多部门数据权限

```javascript
// 在 API 请求中自动携带部门信息
request.interceptors.request.use(config => {
  const user = getUser()
  if (user?.department) {
    config.headers['X-Department'] = user.department
  }
  return config
})
```

### 菜单配置化

当菜单由后端配置时，只需修改 `permission.js`：

```javascript
const generateRoutes = async (userRoles) => {
  const menuResponse = await request.get('/api/menus')
  const menuData = menuResponse.data
  
  const accessRoutes = filterRoutes(menuData, userRoles)
  menuList.value = accessRoutes
  
  return accessRoutes
}
```