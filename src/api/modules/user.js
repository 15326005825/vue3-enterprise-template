import request from '../index'
import { isMockEnabled, mockResponse, mockError, userMock } from '../mock'

export const login = (data) => {
  if (isMockEnabled()) {
    const result = userMock.login(data)
    if (result) {
      return mockResponse(result, 500)
    }
    return mockError('用户名或密码错误', 401)
  }
  return request.post('/user/login', data)
}

export const getUserInfo = () => {
  if (isMockEnabled()) {
    return mockResponse(userMock.getUserInfo())
  }
  return request.get('/user/info')
}

export const logout = () => {
  if (isMockEnabled()) {
    return mockResponse(userMock.logout(), 200)
  }
  return request.post('/user/logout')
}

export const updatePassword = (data) => {
  if (isMockEnabled()) {
    return mockResponse(userMock.updatePassword(), 200)
  }
  return request.put('/user/password', data)
}

export const getUserList = (params) => {
  if (isMockEnabled()) {
    const list = [
      { id: 1, username: 'admin', name: '管理员', email: 'admin@example.com', role: 'admin', department: '技术部', status: 'active' },
      { id: 2, username: 'user', name: '普通用户', email: 'user@example.com', role: 'user', department: '运营部', status: 'active' },
      { id: 3, username: 'guest', name: '访客', email: 'guest@example.com', role: 'guest', department: '市场部', status: 'disabled' }
    ]
    return mockResponse({ list, total: list.length })
  }
  return request.get('/user/list', params)
}

export const addUser = (data) => {
  if (isMockEnabled()) {
    return mockResponse({ id: Date.now(), ...data })
  }
  return request.post('/user/add', data)
}

export const updateUser = (data) => {
  if (isMockEnabled()) {
    return mockResponse(data)
  }
  return request.put('/user/update', data)
}

export const deleteUser = (id) => {
  if (isMockEnabled()) {
    return mockResponse({ id })
  }
  return request.del(`/user/delete/${id}`)
}