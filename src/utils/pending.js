import axios from 'axios'

const pendingMap = new Map()

const getKey = (config) => {
  const { url, method, params, data } = config
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

export const addPending = (config) => {
  const key = getKey(config)
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if (!pendingMap.has(key)) {
      pendingMap.set(key, cancel)
    }
  })
}

export const removePending = (config) => {
  const key = getKey(config)
  if (pendingMap.has(key)) {
    const cancel = pendingMap.get(key)
    cancel(key)
    pendingMap.delete(key)
  }
}

export const clearPending = () => {
  pendingMap.forEach((cancel) => cancel())
  pendingMap.clear()
}

export const isCancel = (error) => axios.isCancel(error)

export default {
  addPending,
  removePending,
  clearPending,
  isCancel
}