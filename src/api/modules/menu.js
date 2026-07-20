import request from '../index'
import { isMockEnabled, mockResponse, menuMock } from '../mock'

export const getMenuList = () => {
  if (isMockEnabled()) {
    return mockResponse(menuMock)
  }
  return request.get('/menu/list')
}

export const getMenuTree = () => {
  if (isMockEnabled()) {
    return mockResponse(menuMock)
  }
  return request.get('/menu/tree')
}

export const addMenu = (data) => {
  if (isMockEnabled()) {
    return mockResponse({ id: Date.now(), ...data })
  }
  return request.post('/menu/add', data)
}

export const updateMenu = (data) => {
  if (isMockEnabled()) {
    return mockResponse(data)
  }
  return request.put('/menu/update', data)
}

export const deleteMenu = (id) => {
  if (isMockEnabled()) {
    return mockResponse({ id })
  }
  return request.del(`/menu/delete/${id}`)
}