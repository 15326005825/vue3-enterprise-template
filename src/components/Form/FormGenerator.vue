<template>
  <div class="form-generator">
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      :label-width="labelWidth"
      :inline="inline"
      :layout="layout"
      :disabled="disabled"
      class="generator-form"
      @submit.prevent="handleSubmit"
    >
      <el-row v-if="layout === 'grid'" :gutter="gutter">
        <template v-for="field in visibleFields" :key="field.prop">
          <el-col
            :span="getSpan(field)"
            :xs="field.xs || 24"
            :sm="field.sm || 12"
            :md="field.md || 8"
            :lg="field.lg || 6"
            :xl="field.xl || 4"
          >
            <FormField
              :field="field"
              :model-value="form[field.prop]"
              @update:model-value="(val) => form[field.prop] = val"
              @change="handleFieldChange"
              @blur="handleFieldBlur"
              @focus="handleFieldFocus"
            />
          </el-col>
        </template>
      </el-row>

      <template v-else>
        <FormField
          v-for="field in visibleFields"
          :key="field.prop"
          :field="field"
          :model-value="form[field.prop]"
          @update:model-value="(val) => form[field.prop] = val"
          @change="handleFieldChange"
          @blur="handleFieldBlur"
          @focus="handleFieldFocus"
        />
      </template>

      <div class="form-actions" v-if="showActions">
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ submitText || '提交' }}
        </el-button>
        <el-button @click="handleReset">
          {{ resetText || '重置' }}
        </el-button>
        <slot name="actions" />
      </div>
    </el-form>
  </div>
</template>

<script setup>import { ref, reactive, computed, watch, onMounted } from 'vue';
import FormField from './FormField.vue';
import { generateFormRules } from '@utils/validateRules';
import { useLinkage } from '@composables/useLinkage';
import { useDynamicFields } from '@composables/useDynamicFields';
const props = defineProps({
 schema: {
 type: Object,
 required: true
 },
 modelValue: {
 type: Object,
 default: () => ({})
 },
 labelWidth: {
 type: String,
 default: '100px'
 },
 inline: {
 type: Boolean,
 default: false
 },
 layout: {
 type: String,
 default: 'horizontal',
 validator: (value) => ['horizontal', 'vertical', 'inline', 'grid'].includes(value)
 },
 gutter: {
 type: Number,
 default: 20
 },
 disabled: {
 type: Boolean,
 default: false
 },
 showActions: {
 type: Boolean,
 default: true
 },
 submitText: {
 type: String,
 default: '提交'
 },
 resetText: {
 type: String,
 default: '重置'
 },
 loading: {
 type: Boolean,
 default: false
 }
});
const emit = defineEmits(['update:modelValue', 'submit', 'reset', 'change', 'blur', 'focus']);
const formRef = ref(null);
const form = reactive({});
const { fields, addField, removeField, removeFieldByProp, updateField, toggleField, getFieldByProp, getVisibleFields } = useDynamicFields(props.schema.fields || []);
const visibleFields = computed(() => getVisibleFields());
const formRules = computed(() => {
 return generateFormRules(fields, form);
});
const { initLinkage, cascaderLinkage, typeSubtypeLinkage, showHideLinkage } = useLinkage(form, fields);
const initForm = () => {
 if (props.schema.fields) {
 props.schema.fields.forEach(field => {
 let defaultValue;
 if (field.default !== undefined) {
 defaultValue = field.default;
 } else if (field.type === 'upload' || field.type === 'checkbox') {
 defaultValue = [];
 } else if (field.type === 'switch') {
 defaultValue = false;
 } else {
 defaultValue = '';
 }
 if (!(field.prop in form)) {
 form[field.prop] = defaultValue;
 }
 if (props.modelValue && props.modelValue[field.prop] !== undefined) {
 const value = props.modelValue[field.prop];
 if ((field.type === 'upload' || field.type === 'checkbox') && !Array.isArray(value)) {
 form[field.prop] = value ? [value] : [];
 } else {
 form[field.prop] = value;
 }
 }
 });
 }
};
const getSpan = (field) => {
 if (field.span)
 return field.span;
 const gridSpan = {
 horizontal: 24,
 vertical: 24,
 inline: 8,
 grid: 8
 };
 return gridSpan[props.layout] || 8;
};
const handleFieldChange = (value, field) => {
 emit('change', { prop: field.prop, value, field });
};
const handleFieldBlur = (event, field) => {
 emit('blur', { prop: field.prop, event, field });
};
const handleFieldFocus = (event, field) => {
 emit('focus', { prop: field.prop, event, field });
};
const validate = async () => {
 if (!formRef.value)
 return true;
 try {
 await formRef.value.validate();
 return true;
 }
 catch (error) {
 return false;
 }
};
const validateField = async (prop) => {
 if (!formRef.value)
 return;
 await formRef.value.validateField(prop);
};
const resetFields = () => {
 if (formRef.value) {
 formRef.value.resetFields();
 }
 initForm();
};
const handleSubmit = async () => {
 const isValid = await validate();
 if (isValid) {
 emit('submit', { ...form });
 emit('update:modelValue', { ...form });
 }
};
const handleReset = () => {
 resetFields();
 emit('reset');
};
const setFormValue = (data) => {
 Object.keys(data).forEach(key => {
 if (key in form) {
 const field = fields.find(f => f.prop === key);
 const value = data[key];
 if (field && (field.type === 'upload' || field.type === 'checkbox') && !Array.isArray(value)) {
 form[key] = value ? [value] : [];
 } else {
 form[key] = value;
 }
 }
 });
};
const getFormValue = () => {
 return { ...form };
};
watch(() => props.schema.fields, (newFields) => {
 if (newFields) {
 newFields.forEach(field => {
 if (!(field.prop in form)) {
 form[field.prop] = field.default !== undefined ? field.default : '';
 }
 });
 }
}, { deep: true });
watch(() => props.modelValue, (newValue) => {
 if (newValue) {
 setFormValue(newValue);
 }
}, { deep: true });
onMounted(() => {
 initForm();
 initLinkage();
 if (props.schema.linkage && props.schema.linkage.cascader) {
 props.schema.linkage.cascader.forEach(item => {
 cascaderLinkage(item.watchField, item.targetFields, item.dataMap);
 });
 }
 if (props.schema.linkage && props.schema.linkage.typeSubtype) {
 props.schema.linkage.typeSubtype.forEach(item => {
 typeSubtypeLinkage(item.typeField, item.subtypeField, item.typeSubtypeMap);
 });
 }
 if (props.schema.linkage && props.schema.linkage.showHide) {
 props.schema.linkage.showHide.forEach(item => {
 showHideLinkage(item.watchField, item.targetField, item.condition);
 });
 }
});
defineExpose({
 formRef,
 form,
 fields,
 validate,
 validateField,
 resetFields,
 setFormValue,
 getFormValue,
 addField,
 removeField,
 removeFieldByProp,
 updateField,
 toggleField,
 getFieldByProp
});
</script>

<style lang="scss" scoped>
.form-generator {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;

  .generator-form {
    margin-bottom: 0;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e4e7ed;
  }
}
</style>