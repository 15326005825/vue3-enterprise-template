# 接口配置文档

## 概述

本项目封装了企业级 Axios 请求模块，支持多环境配置、统一错误处理、Token自动刷新、请求取消（防重复提交）、接口Mock等功能。

## 功能清单

| 功能 | 说明 |
|------|------|
| Axios实例封装 | 统一配置 baseURL、timeout、headers |
| 统一错误处理 | 401/403/404/400/500/502/503/504 状态码处理 |
| Token过期自动刷新 | 401时自动调用刷新接口，重发排队请求 |
| 请求取消（防重复提交） | 相同请求自动取消前一个，避免重复提交 |
| 请求/响应拦截器 | 自动注入Token、统一处理响应 |
| 多环境配置 | dev/test/prod 三套环境变量 |
| 接口Mock | 开发环境通过开关启用，前后端并行开发 |

## 文件结构

```
src/api/
├── index.js              # Axios实例 + 快捷方法
├── interceptors.js       # 请求/响应拦截器
├── mock/                 # Mock数据
│   ├── index.js          # Mock工具函数
│   ├── user.js           # 用户接口Mock
│   └── menu.js           # 菜单接口Mock
└── modules/              # 业务接口模块
    ├── user.js           # 用户相关接口
    └── menu.js           # 菜单相关接口
```

## 多环境配置

### 环境文件

| 文件 | 环境 | 启动命令 |
|------|------|----------|
| `.env.development` | 开发环境 | `npm run dev` |
| `.env.test` | 测试环境 | `npm run dev:test` |
| `.env.production` | 生产环境 | `npm run build` |

### 环境变量

| 变量 | 说明 | dev | test | prod |
|------|------|-----|------|------|
| `VITE_APP_TITLE` | 系统标题 | 管理系统 | 管理系统（测试） | 管理系统 |
| `VITE_API_BASE_URL` | 接口基础路径 | /api | /api | /api |
| `VITE_PROXY_TARGET` | 代理目标地址 | http://localhost:3000 | http://test-server... | - |
| `VITE_USE_MOCK` | 是否启用Mock | true | false | false |
| `VITE_REFRESH_TOKEN_URL` | Token刷新接口 | /auth/refresh | /auth/refresh | /auth/refresh |

### NPM Scripts

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发环境启动 |
| `npm run dev:test` | 测试环境启动 |
| `npm run dev:prod` | 生产环境配置启动 |
| `npm run build` | 生产环境构建 |
| `npm run build:test` | 测试环境构建 |

## Axios 实例

### 基础配置

```javascript
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})
```

### 快捷方法

| 方法 | 说明 | 示例 |
|------|------|------|
| `get(url, params, config)` | GET请求 | `get('/user/list', { page: 1 })` |
| `post(url, data, config)` | POST请求 | `post('/user/login', { username, password })` |
| `put(url, data, config)` | PUT请求 | `put('/user/update', { id, name })` |
| `del(url, params, config)` | DELETE请求 | `del('/user/delete/1')` |
| `upload(url, data, config)` | 文件上传 | `upload('/file/upload', formData)` |
| `download(url, params, config)` | 文件下载 | `download('/file/export', { id })` |

### 请求配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `repeatCancel` | Boolean | true | 是否取消重复请求（false则允许重复） |
| `silent` | Boolean | false | 是否静默错误（不弹出提示） |

**使用示例：**

```javascript
// 允许重复请求（不取消）
get('/user/list', {}, { repeatCancel: false })

// 静默错误（不弹出ElMessage）
post('/user/login', data, { silent: true })
```

## 拦截器

### 请求拦截器

1. **重复请求取消**：根据 url + method + params + data 生成唯一key，自动取消前一个相同请求
2. **Token注入**：自动添加 `Authorization: Bearer token` 到请求头

### 响应拦截器

1. **成功处理**：`code === 200` 返回完整响应数据
2. **401处理**：Token过期自动刷新，刷新成功后重发排队请求
3. **错误处理**：统一弹窗提示，支持所有HTTP状态码

### 统一错误处理

| 状态码 | 处理方式 |
|--------|----------|
| 401 | 尝试刷新Token，失败则跳转登录页 |
| 403 | 提示"暂无权限访问" |
| 404 | 提示"请求资源不存在" |
| 400 | 提示后端返回的具体错误信息 |
| 500 | 提示"服务器内部错误" |
| 502 | 提示"网关错误" |
| 503 | 提示"服务不可用" |
| 504 | 提示"网关超时" |
| timeout | 提示"请求超时，请稍后重试" |
| Network Error | 提示"网络连接失败，请检查网络" |

## Token 自动刷新

### 刷新流程

```
请求返回401 → 检查是否正在刷新 → 是：加入等待队列
                                  → 否：调用刷新接口
                                        → 成功：重发队列请求
                                        → 失败：跳转登录页
```

### 配置

刷新接口地址通过 `VITE_REFRESH_TOKEN_URL` 环境变量配置。

### Token 存储

| Token类型 | 存储位置 | 说明 |
|-----------|----------|------|
| access_token | localStorage + Cookie | 访问令牌 |
| refresh_token | localStorage | 刷新令牌 |

## 请求取消（防重复提交）

### 原理

通过 `axios.CancelToken` 实现。每个请求根据 `url + method + params + data` 生成唯一标识，当检测到相同请求时自动取消前一个。

### 跳过取消

```javascript
// 设置 repeatCancel: false 跳过取消逻辑
post('/user/list', data, { repeatCancel: false })
```

### 手动清除所有请求

```javascript
import { clearPending } from '@utils/pending'
clearPending()
```

## 接口 Mock

### 启用/关闭

通过环境变量 `VITE_USE_MOCK` 控制：
- `true`：启用Mock
- `false`：使用真实接口

### Mock 文件位置

```
src/api/mock/
├── index.js    # Mock工具（isMockEnabled, mockResponse, mockError）
├── user.js     # 用户接口Mock数据
└── menu.js     # 菜单接口Mock数据
```

### 使用方式

业务模块通过 `isMockEnabled()` 判断是否走Mock：

```javascript
import request from '../index'
import { isMockEnabled, mockResponse, userMock } from '../mock'

export const login = (data) => {
  if (isMockEnabled()) {
    const result = userMock.login(data)
    if (result) return mockResponse(result)
    return mockError('用户名或密码错误', 401)
  }
  return request.post('/user/login', data)
}
```

### Mock 工具函数

| 函数 | 说明 |
|------|------|
| `isMockEnabled()` | 判断Mock是否启用 |
| `mockResponse(data, delay)` | 返回成功响应（code: 200） |
| `mockError(message, code, delay)` | 返回错误响应 |

## 接口模块

### 用户接口 (user.js)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| login | POST | /user/login | 登录 |
| getUserInfo | GET | /user/info | 获取用户信息 |
| logout | POST | /user/logout | 退出登录 |
| updatePassword | PUT | /user/password | 修改密码 |
| getUserList | GET | /user/list | 用户列表 |
| addUser | POST | /user/add | 添加用户 |
| updateUser | PUT | /user/update | 更新用户 |
| deleteUser | DELETE | /user/delete/:id | 删除用户 |

### 菜单接口 (menu.js)

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| getMenuList | GET | /menu/list | 获取菜单列表 |
| getMenuTree | GET | /menu/tree | 获取菜单树 |
| addMenu | POST | /menu/add | 添加菜单 |
| updateMenu | PUT | /menu/update | 更新菜单 |
| deleteMenu | DELETE | /menu/delete/:id | 删除菜单 |

## 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

| 字段 | 说明 |
|------|------|
| code | 状态码，200成功，其他失败 |
| message | 提示信息 |
| data | 返回数据 |

## 新增接口流程

### 1. 创建接口模块

在 `src/api/modules/` 下创建或编辑模块文件：

```javascript
import request from '../index'
import { isMockEnabled, mockResponse } from '../mock'

export const getOrderList = (params) => {
  if (isMockEnabled()) {
    return mockResponse({ list: [], total: 0 })
  }
  return request.get('/order/list', params)
}
```

### 2. 页面调用

```vue
<script setup>
import { getOrderList } from '@api/modules/order'

const loadData = async () => {
  const res = await getOrderList({ page: 1 })
  if (res.code === 200) {
    console.log(res.data)
  }
}
</script>
```

## 注意事项

1. **Mock开关**：生产环境务必关闭Mock（`VITE_USE_MOCK=false`）
2. **Token刷新**：需要后端提供 `refreshToken` 接口，登录时返回 `refreshToken`
3. **重复请求**：GET查询类请求默认会取消重复，如需并发请设置 `repeatCancel: false`
4. **错误静默**：设置 `silent: true` 可关闭错误弹窗，需自行处理错误
5. **Vite代理**：开发环境通过 `vite.config.js` 中的 proxy 配置解决跨域
