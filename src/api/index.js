import axios from 'axios'
import { setupInterceptors } from './interceptors'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

setupInterceptors(request)

export const get = (url, params = {}, config = {}) => {
  return request.get(url, { params, ...config })
}

export const post = (url, data = {}, config = {}) => {
  return request.post(url, data, config)
}

export const put = (url, data = {}, config = {}) => {
  return request.put(url, data, config)
}

export const del = (url, params = {}, config = {}) => {
  return request.delete(url, { params, ...config })
}

export const upload = (url, data = {}, config = {}) => {
  return request.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  })
}

export const download = (url, params = {}, config = {}) => {
  return request.get(url, {
    params,
    responseType: 'blob',
    ...config
  })
}

export default request