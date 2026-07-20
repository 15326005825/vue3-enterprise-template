import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, getUserInfo, logout } from '@api/modules/user'
import { setToken, removeToken, setUser, removeUser, saveRememberUser, clearRememberUser } from '@utils/auth'
import { usePermissionStore } from './permission'
import router from '@router/index'

export const useUserStore = defineStore('user', () => {
  const user = ref({
    id: '',
    name: '',
    avatar: '',
    email: '',
    roles: [],
    department: '',
    permissions: []
  })

  const loginAction = async (data) => {
    const result = await login(data)

    if (result.code === 200) {
      const token = result.data.token
      setToken(token)
      setUser(result.data.user)
      user.value = result.data.user

      if (result.data.refreshToken) {
        localStorage.setItem('refresh_token', result.data.refreshToken)
      }

      if (data.remember) {
        saveRememberUser(data.username, data.password)
      } else {
        clearRememberUser()
      }
    }

    return result
  }

  const getUserInfoAction = async () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
      return { code: 200, data: user.value }
    }
    
    const result = await getUserInfo()
    if (result.code === 200) {
      user.value = result.data
      setUser(result.data)
    }
    return result
  }

  const logoutAction = async () => {
    await logout()
    
    user.value = {
      id: '',
      name: '',
      avatar: '',
      email: '',
      roles: [],
      department: '',
      permissions: []
    }
    
    removeToken()
    removeUser()
    clearRememberUser()
    localStorage.removeItem('refresh_token')
    
    const permissionStore = usePermissionStore()
    permissionStore.clearTags()
    
    router.push('/login')
  }

  const updateUserInfo = (info) => {
    user.value = { ...user.value, ...info }
    setUser(user.value)
  }

  return {
    user,
    login: loginAction,
    getUserInfo: getUserInfoAction,
    logout: logoutAction,
    updateUserInfo
  }
})