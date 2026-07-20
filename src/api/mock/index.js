export const isMockEnabled = () => {
  return import.meta.env.VITE_USE_MOCK === 'true'
}

export const mockResponse = (data, delay = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data
      })
    }, delay)
  })
}

export const mockError = (message, code = 500, delay = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code,
        message
      })
    }, delay)
  })
}

export { default as userMock } from './user'
export { default as menuMock } from './menu'