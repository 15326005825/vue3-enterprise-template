import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

export const useForm = (initForm = {}, validateRules = {}) => {
  const form = reactive({ ...initForm })
  const formRef = ref(null)
  const loading = ref(false)

  const resetForm = () => {
    Object.keys(initForm).forEach(key => {
      form[key] = initForm[key]
    })
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }

  const validateForm = async () => {
    if (!formRef.value) return true
    try {
      await formRef.value.validate()
      return true
    } catch (error) {
      return false
    }
  }

  const submitForm = async (submitFn) => {
    const isValid = await validateForm()
    if (!isValid) return false

    loading.value = true
    try {
      await submitFn(form)
      ElMessage.success('操作成功')
      return true
    } catch (error) {
      ElMessage.error(error.message || '操作失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const setFormValue = (data) => {
    Object.keys(data).forEach(key => {
      if (key in form) {
        form[key] = data[key]
      }
    })
  }

  return {
    form,
    formRef,
    loading,
    resetForm,
    validateForm,
    submitForm,
    setFormValue
  }
}