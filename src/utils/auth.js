const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const REMEMBER_KEY = 'remembered_user'

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY) || getCookie(TOKEN_KEY)
  return token
}

export const setToken = (token, expires = 7) => {
  localStorage.setItem(TOKEN_KEY, token)
  setCookie(TOKEN_KEY, token, expires)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  removeCookie(TOKEN_KEY)
}

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY) || getCookie(USER_KEY)
  return user ? JSON.parse(user) : null
}

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  setCookie(USER_KEY, JSON.stringify(user), 7)
}

export const removeUser = () => {
  localStorage.removeItem(USER_KEY)
  removeCookie(USER_KEY)
}

export const isAuthenticated = () => {
  return !!getToken()
}

export const saveRememberUser = (username, password) => {
  localStorage.setItem(REMEMBER_KEY, JSON.stringify({ username, password }))
}

export const getRememberUser = () => {
  const user = localStorage.getItem(REMEMBER_KEY)
  return user ? JSON.parse(user) : null
}

export const clearRememberUser = () => {
  localStorage.removeItem(REMEMBER_KEY)
}

const setCookie = (name, value, days) => {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/;HttpOnly;SameSite=Lax`
}

const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

const removeCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}