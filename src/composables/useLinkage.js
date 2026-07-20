import { watch, reactive } from 'vue'

export const useLinkage = (form, fields) => {
  const linkageMap = reactive({})

  const initLinkage = () => {
    fields.forEach(field => {
      if (field.linkage && field.linkage.watch) {
        const watchField = field.linkage.watch
        const handler = field.linkage.handler

        if (typeof handler === 'function') {
          watch(
            () => form[watchField],
            (newVal, oldVal) => {
              handler(newVal, oldVal, form, fields)
            },
            { immediate: field.linkage.immediate }
          )
        }
      }
    })
  }

  const updateFieldOptions = (fieldProp, options) => {
    const field = fields.find(f => f.prop === fieldProp)
    if (field) {
      field.options = options
    }
  }

  const setFieldValue = (fieldProp, value) => {
    form[fieldProp] = value
  }

  const setFieldVisible = (fieldProp, visible) => {
    const field = fields.find(f => f.prop === fieldProp)
    if (field) {
      field.visible = visible
    }
  }

  const setFieldDisabled = (fieldProp, disabled) => {
    const field = fields.find(f => f.prop === fieldProp)
    if (field) {
      field.disabled = disabled
    }
  }

  const setFieldRequired = (fieldProp, required) => {
    const field = fields.find(f => f.prop === fieldProp)
    if (field) {
      const requiredRule = field.rules?.find(r => r.type === 'required')
      if (requiredRule) {
        requiredRule.enabled = required
      } else if (required && field.rules) {
        field.rules.unshift({ type: 'required', message: `请输入${field.label}` })
      }
    }
  }

  const cascaderLinkage = (watchField, targetFields, dataMap) => {
    watch(
      () => form[watchField],
      (newVal) => {
        targetFields.forEach(targetField => {
          const options = dataMap[newVal] || []
          updateFieldOptions(targetField, options)
          setFieldValue(targetField, '')
        })
      },
      { immediate: true }
    )
  }

  const typeSubtypeLinkage = (typeField, subtypeField, typeSubtypeMap) => {
    watch(
      () => form[typeField],
      (newVal) => {
        const subtypes = typeSubtypeMap[newVal] || []
        updateFieldOptions(subtypeField, subtypes)
        setFieldValue(subtypeField, '')
      },
      { immediate: true }
    )
  }

  const showHideLinkage = (watchField, targetField, condition) => {
    watch(
      () => form[watchField],
      (newVal) => {
        const visible = typeof condition === 'function'
          ? condition(newVal)
          : newVal === condition
        setFieldVisible(targetField, visible)
      },
      { immediate: true }
    )
  }

  return {
    initLinkage,
    updateFieldOptions,
    setFieldValue,
    setFieldVisible,
    setFieldDisabled,
    setFieldRequired,
    cascaderLinkage,
    typeSubtypeLinkage,
    showHideLinkage,
    linkageMap
  }
}