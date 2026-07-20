<template>
  <el-form-item
    :prop="field.prop"
    :label="field.label"
    :label-width="field.labelWidth || '100px'"
    :required="hasRequiredRule"
    :span="field.span"
    v-show="field.visible !== false"
  >
    <el-input
      v-if="field.type === 'input'"
      :model-value="modelValue"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
      :size="field.size || 'default'"
      :type="field.inputType || 'text'"
      :maxlength="field.maxlength"
      :show-word-limit="field.showWordLimit"
      :prefix-icon="field.prefixIcon"
      :suffix-icon="field.suffixIcon"
      :clearable="field.clearable !== false"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      @update:model-value="handleUpdateModelValue"
    />

    <el-select
      v-else-if="field.type === 'select'"
      :model-value="modelValue"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
      :size="field.size || 'default'"
      :multiple="field.multiple"
      :filterable="field.filterable"
      :clearable="field.clearable !== false"
      :remote="field.remote"
      :remote-method="field.remoteMethod"
      :loading="field.loading"
      @change="handleChange"
      @update:model-value="handleUpdateModelValue"
    >
      <el-option
        v-for="option in field.options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>

    <el-cascader
      v-else-if="field.type === 'cascader'"
      :model-value="modelValue"
      :options="field.options"
      :props="field.cascaderProps || { checkStrictly: true }"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
      :clearable="field.clearable !== false"
      @change="handleChange"
      @update:model-value="handleUpdateModelValue"
    />

    <el-date-picker
      v-else-if="field.type === 'date'"
      :model-value="modelValue"
      :type="field.dateType || 'date'"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
      :size="field.size || 'default'"
      :format="field.format"
      :value-format="field.valueFormat || 'YYYY-MM-DD'"
      :range-separator="field.rangeSeparator || '至'"
      :start-placeholder="field.startPlaceholder"
      :end-placeholder="field.endPlaceholder"
      :picker-options="field.pickerOptions"
      :clearable="field.clearable !== false"
      @change="handleChange"
      @update:model-value="handleUpdateModelValue"
    />

    <el-time-picker
      v-else-if="field.type === 'time'"
      :model-value="modelValue"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
      :size="field.size || 'default'"
      :format="field.format || 'HH:mm:ss'"
      :value-format="field.valueFormat"
      :picker-options="field.pickerOptions"
      :clearable="field.clearable !== false"
      @change="handleChange"
      @update:model-value="handleUpdateModelValue"
    />

    <el-date-picker
      v-else-if="field.type === 'datetime'"
      :model-value="modelValue"
      type="datetime"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
      :size="field.size || 'default'"
      :format="field.format || 'YYYY-MM-DD HH:mm:ss'"
      :value-format="field.valueFormat"
      :picker-options="field.pickerOptions"
      :clearable="field.clearable !== false"
      @change="handleChange"
      @update:model-value="handleUpdateModelValue"
    />

    <el-switch
      v-else-if="field.type === 'switch'"
      :model-value="modelValue"
      :disabled="field.disabled"
      :active-value="field.activeValue || true"
      :inactive-value="field.inactiveValue || false"
      :active-text="field.activeText"
      :inactive-text="field.inactiveText"
      @change="handleChange"
      @update:model-value="handleUpdateModelValue"
    />

    <el-radio-group
      v-else-if="field.type === 'radio'"
      :model-value="modelValue"
      :disabled="field.disabled"
      :size="field.size || 'default'"
      @change="handleChange"
      @update:model-value="handleUpdateModelValue"
    >
      <el-radio
        v-for="option in field.options"
        :key="option.value"
        :label="option.value"
        :border="field.border"
      >
        {{ option.label }}
      </el-radio>
    </el-radio-group>

    <el-checkbox-group
      v-else-if="field.type === 'checkbox'"
      :model-value="modelValue"
      :disabled="field.disabled"
      @change="handleChange"
      @update:model-value="handleUpdateModelValue"
    >
      <el-checkbox
        v-for="option in field.options"
        :key="option.value"
        :label="option.value"
        :border="field.border"
        :size="field.size || 'default'"
      >
        {{ option.label }}
      </el-checkbox>
    </el-checkbox-group>

    <el-input
      v-else-if="field.type === 'textarea'"
      :model-value="modelValue"
      type="textarea"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
      :size="field.size || 'default'"
      :rows="field.rows || 4"
      :maxlength="field.maxlength"
      :show-word-limit="field.showWordLimit"
      :autosize="field.autosize"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      @update:model-value="handleUpdateModelValue"
    />

    <el-input-number
      v-else-if="field.type === 'number'"
      :model-value="modelValue"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
      :size="field.size || 'default'"
      :min="field.min"
      :max="field.max"
      :step="field.step || 1"
      :precision="field.precision"
      :controls="field.controls !== false"
      @change="handleChange"
      @update:model-value="handleUpdateModelValue"
    />

    <el-upload
      v-else-if="field.type === 'upload'"
      :action="field.action"
      :data="field.data"
      :headers="field.headers"
      :multiple="field.multiple"
      :show-file-list="field.showFileList !== false"
      :drag="field.drag"
      :accept="field.accept"
      :file-size="field.fileSize"
      :file-list="Array.isArray(modelValue) ? modelValue : []"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :on-remove="handleUploadRemove"
      :on-change="handleUploadChange"
      :before-upload="field.beforeUpload"
      :auto-upload="field.autoUpload !== false"
    >
      <template v-if="field.drag">
        <el-icon :size="48"><UploadFilled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div v-if="field.tips" class="el-upload__tip">{{ field.tips }}</div>
      </template>
      <template v-else>
        <el-button :size="field.size || 'default'" :type="field.buttonType || 'primary'">
          <el-icon><Upload /></el-icon>
          {{ field.buttonText || '点击上传' }}
        </el-button>
        <div v-if="field.tips" class="el-upload__tip">{{ field.tips }}</div>
      </template>
    </el-upload>

    <el-color-picker
      v-else-if="field.type === 'color'"
      :model-value="modelValue"
      :disabled="field.disabled"
      :size="field.size || 'default'"
      :show-alpha="field.showAlpha"
      :color-format="field.colorFormat"
      @change="handleChange"
      @update:model-value="handleUpdateModelValue"
    />

    <div v-else-if="field.type === 'slot'" class="slot-content">
      <slot :field="field" :value="modelValue" />
    </div>

    <div v-else class="unknown-field">
      未知字段类型: {{ field.type }}
    </div>
  </el-form-item>
</template>

<script setup>
import { computed } from 'vue'
import { Upload, UploadFilled } from '@element-plus/icons-vue'

const props = defineProps({
  field: {
    type: Object,
    required: true
  },
  modelValue: {
    type: [String, Number, Boolean, Array, Date, Object],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change', 'input'])

const hasRequiredRule = computed(() => {
  return props.field.rules?.some(rule => rule.type === 'required')
})

const handleBlur = (event) => {
  emit('blur', event, props.field)
}

const handleFocus = (event) => {
  emit('focus', event, props.field)
}

const handleInput = (event) => {
  emit('input', event, props.field)
}

const handleChange = (value) => {
  emit('change', value, props.field)
}

const handleUpdateModelValue = (value) => {
  emit('update:modelValue', value)
}

const handleVisibleChange = (visible) => {
  emit('visible-change', visible, props.field)
}

const handleExpandChange = (value) => {
  emit('expand-change', value, props.field)
}

const handleUploadSuccess = (response, file, fileList) => {
  emit('upload-success', response, file, fileList, props.field)
}

const handleUploadError = (error, file, fileList) => {
  emit('upload-error', error, file, fileList, props.field)
}

const handleUploadRemove = (file, fileList) => {
  emit('upload-remove', file, fileList, props.field)
}

const handleUploadChange = (file, fileList) => {
  emit('upload-change', file, fileList, props.field)
}
</script>

<style lang="scss" scoped>
.slot-content {
  width: 100%;
}

.unknown-field {
  color: #f56c6c;
  font-size: 14px;
}
</style>