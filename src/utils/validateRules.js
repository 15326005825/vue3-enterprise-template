export const validatorTypes = {
  required: {
    create: (message = '请输入') => ({
      required: true,
      message,
      trigger: 'blur'
    })
  },
  minLength: {
    create: (min, message) => ({
      min,
      message: message || `至少输入${min}个字符`,
      trigger: 'blur'
    })
  },
  maxLength: {
    create: (max, message) => ({
      max,
      message: message || `最多输入${max}个字符`,
      trigger: 'blur'
    })
  },
  min: {
    create: (min, message) => ({
      min,
      message: message || `最小值为${min}`,
      trigger: 'blur'
    })
  },
  max: {
    create: (max, message) => ({
      max,
      message: message || `最大值为${max}`,
      trigger: 'blur'
    })
  },
  pattern: {
    create: (pattern, message) => ({
      pattern,
      message: message || '格式不正确',
      trigger: 'blur'
    })
  },
  email: {
    create: (message = '请输入正确的邮箱地址') => ({
      type: 'email',
      message,
      trigger: 'blur'
    })
  },
  phone: {
    create: (message = '请输入正确的手机号码') => ({
      pattern: /^1[3-9]\d{9}$/,
      message,
      trigger: 'blur'
    })
  },
  url: {
    create: (message = '请输入正确的URL地址') => ({
      type: 'url',
      message,
      trigger: 'blur'
    })
  },
  number: {
    create: (message = '请输入数字') => ({
      type: 'number',
      message,
      trigger: 'blur'
    })
  },
  integer: {
    create: (message = '请输入整数') => ({
      type: 'integer',
      message,
      trigger: 'blur'
    })
  },
  float: {
    create: (message = '请输入浮点数') => ({
      validator: (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          callback()
          return
        }
        if (/^-?\d+\.\d+$/.test(value)) {
          callback()
        } else {
          callback(new Error(message))
        }
      },
      trigger: 'blur'
    })
  },
  idCard: {
    create: (message = '请输入正确的身份证号码') => ({
      pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
      message,
      trigger: 'blur'
    })
  },
  chinese: {
    create: (message = '请输入中文') => ({
      pattern: /^[\u4e00-\u9fa5]+$/,
      message,
      trigger: 'blur'
    })
  },
  username: {
    create: (message = '用户名长度应在3-20位之间，只能包含字母、数字和下划线') => ({
      pattern: /^[a-zA-Z0-9_]{3,20}$/,
      message,
      trigger: 'blur'
    })
  },
  password: {
    create: (message = '密码长度应在6-20位之间，包含大小写字母和数字') => ({
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/,
      message,
      trigger: 'blur'
    })
  },
  confirmPassword: {
    create: (passwordField, message = '两次输入的密码不一致') => ({
      validator: (rule, value, callback, form) => {
        if (value === '' || value === undefined || value === null) {
          callback()
          return
        }
        if (form && form[passwordField] === value) {
          callback()
        } else {
          callback(new Error(message))
        }
      },
      trigger: 'blur'
    })
  },
  dateRange: {
    create: (startField, message = '结束日期不能早于开始日期') => ({
      validator: (rule, value, callback, form) => {
        if (!value || !value.length) {
          callback()
          return
        }
        const [startDate, endDate] = value
        if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
          callback(new Error(message))
        } else {
          callback()
        }
      },
      trigger: 'change'
    })
  },
  custom: {
    create: (validatorFn, message = '校验失败') => ({
      validator: (rule, value, callback) => {
        if (typeof validatorFn === 'function') {
          validatorFn(rule, value, callback)
        } else {
          callback(new Error(message))
        }
      },
      trigger: 'blur'
    })
  }
}

export const buildRules = (field) => {
  if (!field || typeof field !== 'object' || !field.rules || !Array.isArray(field.rules)) {
    return []
  }

  return field.rules.map(rule => {
    if (!rule || typeof rule !== 'object') {
      return null
    }
    const { type, config, message } = rule

    if (validatorTypes[type]) {
      return validatorTypes[type].create(config, message)
    }

    return rule
  }).filter(Boolean)
}

export const generateFormRules = (fields, form) => {
  const rules = {}

  if (!fields || !Array.isArray(fields)) {
    return rules
  }

  fields.forEach(field => {
    if (!field || typeof field !== 'object' || !field.prop) {
      return
    }
    if (field.rules && field.rules.length > 0) {
      const fieldRules = buildRules(field)
      rules[field.prop] = fieldRules.map(rule => {
        if (rule && rule.validator && typeof rule.validator === 'function') {
          const originalValidator = rule.validator
          return {
            ...rule,
            validator: (rule, value, callback) => {
              return originalValidator(rule, value, callback, form)
            }
          }
        }
        return rule
      })
    }
  })

  return rules
}