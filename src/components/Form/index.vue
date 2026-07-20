<template>
  <el-form
    :model="form"
    :rules="rules"
    :ref="formRef"
    :label-width="labelWidth"
    :inline="inline"
    class="custom-form"
  >
    <template v-for="item in formItems" :key="item.prop">
      <el-form-item :prop="item.prop" :label="item.label">
        <el-input
          v-if="item.type === 'input'"
          v-model="form[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          :size="item.size || 'default'"
          :type="item.inputType || 'text'"
        />
        <el-select
          v-else-if="item.type === 'select'"
          v-model="form[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          :size="item.size || 'default'"
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="form[item.prop]"
          :type="item.dateType || 'date'"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          :size="item.size || 'default'"
          value-format="YYYY-MM-DD"
        />
        <el-switch
          v-else-if="item.type === 'switch'"
          v-model="form[item.prop]"
          :disabled="item.disabled"
        />
        <el-textarea
          v-else-if="item.type === 'textarea'"
          v-model="form[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          :size="item.size || 'default'"
          :rows="item.rows || 4"
        />
      </el-form-item>
    </template>
    
    <slot name="actions" />
  </el-form>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  form: {
    type: Object,
    required: true
  },
  formItems: {
    type: Array,
    default: () => []
  },
  rules: {
    type: Object,
    default: () => {}
  },
  labelWidth: {
    type: String,
    default: '100px'
  },
  inline: {
    type: Boolean,
    default: false
  }
})

const formRef = ref(null)

defineExpose({
  formRef,
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields()
})
</script>

<style lang="scss" scoped>
.custom-form {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
}
</style>