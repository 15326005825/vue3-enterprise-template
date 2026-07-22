export default {
  login: (data) => {
    if (data.username === 'admin' && data.password === '123456') {
      return {
        token: 'mock-token-' + Date.now(),
        refreshToken: 'mock-refresh-' + Date.now(),
        user: {
          id: '1',
          name: '管理员',
          avatar: '',
          email: 'admin@example.com',
          roles: ['admin'],
          department: '技术部'
        }
      }
    }
    if (data.username === 'manager' && data.password === '123456') {
      return {
        token: 'mock-token-manager-' + Date.now(),
        refreshToken: 'mock-refresh-manager-' + Date.now(),
        user: {
          id: '2',
          name: '管理用户',
          avatar: '',
          email: 'manager@example.com',
          roles: ['manager'],
          department: '技术部'
        }
      }
    }
    if (data.username === 'user' && data.password === '123456') {
      return {
        token: 'mock-token-user-' + Date.now(),
        refreshToken: 'mock-refresh-user-' + Date.now(),
        user: {
          id: '3',
          name: '普通用户',
          avatar: '',
          email: 'user@example.com',
          roles: ['user'],
          department: '运营部'
        }
      }
    }
    return null
  },
  getUserInfo: () => {
    return {
      id: '1',
      name: '管理员',
      avatar: '',
      email: 'admin@example.com',
      roles: ['admin'],
      department: '技术部',
      permissions: ['user:list', 'user:add', 'user:edit', 'user:delete', 'settings:view', 'settings:edit']
    }
  },
  logout: () => {
    return { message: '退出成功' }
  },
  updatePassword: () => {
    return { message: '密码修改成功' }
  }
}