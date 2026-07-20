import { reactive } from 'vue'

export const useDynamicFields = (fields) => {
  const safeFields = fields ? fields.filter(f => f && typeof f === 'object') : []
  const dynamicFields = reactive([...safeFields])

  const addField = (field, index = dynamicFields.length) => {
    const newField = { ...field }
    if (field.prop && field.isDynamic) {
      const timestamp = Date.now()
      const random = Math.random().toString(36).substr(2, 9)
      newField.prop = `${field.prop}_${timestamp}_${random}`
    }
    dynamicFields.splice(index, 0, newField)
    return newField
  }

  const removeField = (index) => {
    if (index >= 0 && index < dynamicFields.length) {
      const removedField = dynamicFields[index]
      dynamicFields.splice(index, 1)
      return removedField
    }
    return null
  }

  const removeFieldByProp = (prop) => {
    const index = dynamicFields.findIndex(f => f.prop === prop)
    return removeField(index)
  }

  const updateField = (prop, updates) => {
    const field = dynamicFields.find(f => f.prop === prop)
    if (field) {
      Object.assign(field, updates)
      return field
    }
    return null
  }

  const insertFieldAfter = (targetProp, field) => {
    const index = dynamicFields.findIndex(f => f.prop === targetProp)
    if (index >= 0) {
      return addField(field, index + 1)
    }
    return addField(field)
  }

  const insertFieldBefore = (targetProp, field) => {
    const index = dynamicFields.findIndex(f => f.prop === targetProp)
    if (index >= 0) {
      return addField(field, index)
    }
    return addField(field)
  }

  const toggleField = (prop) => {
    const field = dynamicFields.find(f => f.prop === prop)
    if (field) {
      field.visible = !field.visible
      return field
    }
    return null
  }

  const moveField = (fromIndex, toIndex) => {
    if (fromIndex >= 0 && fromIndex < dynamicFields.length &&
        toIndex >= 0 && toIndex < dynamicFields.length) {
      const [removed] = dynamicFields.splice(fromIndex, 1)
      dynamicFields.splice(toIndex, 0, removed)
      return removed
    }
    return null
  }

  const addFields = (newFields) => {
    newFields.forEach(field => {
      addField(field)
    })
  }

  const removeFields = (props) => {
    props.forEach(prop => {
      removeFieldByProp(prop)
    })
  }

  const clearDynamicFields = () => {
    const dynamicIndices = []
    dynamicFields.forEach((field, index) => {
      if (field.isDynamic) {
        dynamicIndices.push(index)
      }
    })
    for (let i = dynamicIndices.length - 1; i >= 0; i--) {
      removeField(dynamicIndices[i])
    }
  }

  const getFieldByProp = (prop) => {
    return dynamicFields.find(f => f.prop === prop)
  }

  const getFieldsByType = (type) => {
    return dynamicFields.filter(f => f.type === type)
  }

  const getVisibleFields = () => {
    return dynamicFields.filter(f => f.visible !== false)
  }

  return {
    fields: dynamicFields,
    addField,
    removeField,
    removeFieldByProp,
    updateField,
    insertFieldAfter,
    insertFieldBefore,
    toggleField,
    moveField,
    addFields,
    removeFields,
    clearDynamicFields,
    getFieldByProp,
    getFieldsByType,
    getVisibleFields
  }
}