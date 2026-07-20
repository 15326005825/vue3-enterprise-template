import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken, removeToken, setToken } from '@utils/auth'
import { addPending, removePending, isCancel, clearPending } from '@utils/pending'
import router from '@router/index'

const REFRESH_URL = import.meta.env.VITE_REFRESH_TOKEN_URL || '/auth/refresh'

let isRefreshing = false
let pendingRequests = []

const redirectToLogin = (showMessage = true) => {
  clearPending()
  removeToken()
  pendingRequests = []
  isRefreshing = false
  if (showMessage) {
    ElMessageBox.confirm(
      '登录状态已失效，请重新登录',
      '系统提示',
      {
        confirmButtonText: '重新登录',
        showCancelButton: false,
        type: 'warning'
      }
    ).then(() => {
      router.push('/login')
    }).catch(() => {
      router.push('/login')
    })
  } else {
    router.push('/login')
  }
}

const refreshToken = () => {
  return new Promise((resolve, reject) => {
    const refreshTokenValue = localStorage.getItem('refresh_token')
    if (!refreshTokenValue) {
      reject(new Error('no refresh token'))
      return
    }
    import('./index').then(({ default: request }) => {
      request.post(REFRESH_URL, { refreshToken: refreshTokenValue })
        .then((res) => {
          if (res.code === 200 && res.data?.token) {
            setToken(res.data.token)
            if (res.data.refreshToken) {
              localStorage.setItem('refresh_token', res.data.refreshToken)
            }
            resolve(res.data.token)
          } else {
            reject(new Error('refresh failed'))
          }
        })
        .catch((err) => reject(err))
    })
  })
}

const showError = (message) => {
  ElMessage.error(message)
}

export const setupInterceptors = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      if (config.repeatCancel !== false) {
        removePending(config)
        addPending(config)
      }

      const token = getToken()
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    (response) => {
      removePending(response.config)

      const { data, config } = response

      if (data.code === 200 || data.code === 0) {
        return data
      }

      if (data.code === 401) {
        if (!isRefreshing) {
          isRefreshing = true
          refreshToken()
            .then(() => {
              isRefreshing = false
              pendingRequests.forEach((cb) => cb())
              pendingRequests = []
            })
            .catch(() => {
              isRefreshing = false
              pendingRequests = []
              redirectToLogin()
            })
        }
        return new Promise((resolve) => {
          pendingRequests.push(() => {
            resolve(instance(response.config))
          })
        })
      }

      if (config.silent !== true) {
        showError(data.message || '请求失败')
      }

      return Promise.reject(data)
    },
    (error) => {
      if (isCancel(error)) {
        return Promise.reject(error)
      }

      if (error.response) {
        const { status, config } = error.response

        switch (status) {
          case 401: {
            if (!isRefreshing) {
              isRefreshing = true
              refreshToken()
                .then(() => {
                  isRefreshing = false
                  pendingRequests.forEach((cb) => cb())
                  pendingRequests = []
                })
                .catch(() => {
                  isRefreshing = false
                  pendingRequests = []
                  redirectToLogin()
                })
            }
            return new Promise((resolve) => {
              pendingRequests.push(() => {
                resolve(instance(config))
              })
            })
          }
          case 403:
            showError('暂无权限访问')
            break
          case 404:
            showError('请求资源不存在')
            break
          case 500:
            showError('服务器内部错误')
            break
          case 502:
            showError('网关错误')
            break
          case 503:
            showError('服务不可用')
            break
          case 504:
            showError('网关超时')
            break
          case 400:
            showError(error.response.data?.message || '请求参数错误')
            break
          default:
            showError(error.response.data?.message || `请求出错(${status})`)
        }
      } else if (error.message?.includes('timeout')) {
        showError('请求超时，请稍后重试')
      } else if (error.message === 'Network Error') {
        showError('网络连接失败，请检查网络')
      } else {
        showError('请求异常')
      }

      return Promise.reject(error)
    }
  )
}

export { redirectToLogin }