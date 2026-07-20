export default {
  login: (data) => {
    if (data.username === 'admin' && data.password === 'admin123') {
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
    if (data.username === 'user' && data.password === 'user123') {
      return {
        token: 'mock-token-user-' + Date.now(),
        refreshToken: 'mock-refresh-user-' + Date.now(),
        user: {
          id: '2',
          name: '普通用户',
          avatar: '',
          email: 'user@example.com',
          roles: ['user'],
          department: '运营部'
        }
      }
    }
    if (data.username === 'guest' && data.password === 'guest123') {
      return {
        token: 'mock-token-guest-' + Date.now(),
        refreshToken: 'mock-refresh-guest-' + Date.now(),
        user: {
          id: '3',
          name: '访客',
          avatar: '',
          email: 'guest@example.com',
          roles: ['guest'],
          department: '访客'
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