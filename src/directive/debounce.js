export const debounce = {
  mounted(el, binding) {
    const { value } = binding
    if (typeof value !== 'function') {
      throw new Error('v-debounce 指令必须绑定一个函数')
    }

    let timer = null
    const delay = binding.arg || 300

    el._debounceHandler = function (...args) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        value.apply(this, args)
      }, delay)
    }

    el.addEventListener('click', el._debounceHandler)
  },
  beforeUnmount(el) {
    if (el._debounceHandler) {
      el.removeEventListener('click', el._debounceHandler)
    }
  }
}