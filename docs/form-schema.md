# 表单生成器 JSON Schema 配置文档

## 概述

表单生成器支持通过 JSON 配置动态生成表单，包含字段定义、校验规则、联动逻辑、动态字段和布局配置等功能。

## 完整配置结构

```json
{
  "fields": [],
  "linkage": {
    "cascader": [],
    "typeSubtype": [],
    "showHide": []
  }
}
```

## 字段配置（fields）

### 通用字段属性

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| prop | string | 是 | 字段唯一标识，对应表单数据的键名 |
| label | string | 是 | 字段标签显示文本 |
| type | string | 是 | 字段类型，见下方字段类型表 |
| placeholder | string | 否 | 占位提示文本 |
| default | any | 否 | 默认值 |
| disabled | boolean | 否 | 是否禁用，默认 false |
| visible | boolean | 否 | 是否显示，默认 true |
| rules | array | 否 | 校验规则数组 |
| size | string | 否 | 字段尺寸，可选：small / default / large |
| labelWidth | string | 否 | 标签宽度，默认 100px |
| span | number | 否 | 栅格布局占比（0-24） |

### 字段类型

| 类型 | 说明 | 对应组件 |
|------|------|----------|
| input | 输入框 | el-input |
| select | 选择器 | el-select |
| cascader | 级联选择器 | el-cascader |
| date | 日期选择器 | el-date-picker |
| time | 时间选择器 | el-time-picker |
| datetime | 日期时间选择器 | el-date-time-picker |
| switch | 开关 | el-switch |
| radio | 单选框 | el-radio-group |
| checkbox | 复选框 | el-checkbox-group |
| textarea | 文本域 | el-textarea |
| number | 数字输入框 | el-input-number |
| upload | 文件上传 | el-upload |
| color | 颜色选择器 | el-color-picker |
| slot | 自定义插槽 | slot |

### 各类型字段特有属性

#### input 输入框

| 属性 | 类型 | 说明 |
|------|------|------|
| inputType | string | 输入类型：text / password / email / phone / number |
| maxlength | number | 最大输入长度 |
| showWordLimit | boolean | 是否显示字数统计 |
| prefixIcon | string/Component | 前置图标 |
| suffixIcon | string/Component | 后置图标 |
| clearable | boolean | 是否可清空 |

#### select 选择器

| 属性 | 类型 | 说明 |
|------|------|------|
| options | array | 选项数组，格式：[{ label, value }] |
| multiple | boolean | 是否多选 |
| filterable | boolean | 是否可搜索 |
| clearable | boolean | 是否可清空 |
| remote | boolean | 是否远程搜索 |
| remoteMethod | function | 远程搜索方法 |

#### cascader 级联选择器

| 属性 | 类型 | 说明 |
|------|------|------|
| options | array | 级联选项数据 |
| cascaderProps | object | 级联配置，如 { checkStrictly: true } |

#### date / datetime 日期选择器

| 属性 | 类型 | 说明 |
|------|------|------|
| dateType | string | 日期类型：date / week / month / year / daterange |
| format | string | 显示格式，如 YYYY-MM-DD HH:mm:ss |
| valueFormat | string | 值格式 |
| pickerOptions | object | 选择器配置 |

#### switch 开关

| 属性 | 类型 | 说明 |
|------|------|------|
| activeValue | any | 开启值，默认 true |
| inactiveValue | any | 关闭值，默认 false |
| activeText | string | 开启文本 |
| inactiveText | string | 关闭文本 |

#### radio / checkbox 单选/多选

| 属性 | 类型 | 说明 |
|------|------|------|
| options | array | 选项数组，格式：[{ label, value }] |
| border | boolean | 是否带边框 |

#### textarea 文本域

| 属性 | 类型 | 说明 |
|------|------|------|
| rows | number | 行数，默认 4 |
| maxlength | number | 最大输入长度 |
| showWordLimit | boolean | 是否显示字数统计 |
| autosize | boolean/object | 是否自动调整高度 |

#### number 数字输入框

| 属性 | 类型 | 说明 |
|------|------|------|
| min | number | 最小值 |
| max | number | 最大值 |
| step | number | 步长，默认 1 |
| precision | number | 精度（小数位数） |
| controls | boolean | 是否显示控制按钮 |

#### upload 文件上传

| 属性 | 类型 | 说明 |
|------|------|------|
| action | string | 上传接口地址 |
| data | object | 额外上传参数 |
| headers | object | 请求头 |
| multiple | boolean | 是否多选 |
| drag | boolean | 是否拖拽上传 |
| accept | string | 接受的文件类型 |
| fileSize | number | 文件大小限制（MB） |
| showFileList | boolean | 是否显示文件列表 |
| autoUpload | boolean | 是否自动上传 |
| beforeUpload | function | 上传前校验 |
| tips | string | 提示文本 |

## 校验规则（rules）

### 内置校验类型

| 类型 | 说明 | 配置示例 |
|------|------|----------|
| required | 必填校验 | `{ type: 'required' }` |
| minLength | 最小长度 | `{ type: 'minLength', min: 6 }` |
| maxLength | 最大长度 | `{ type: 'maxLength', max: 20 }` |
| length | 固定长度 | `{ type: 'length', len: 11 }` |
| min | 最小值 | `{ type: 'min', min: 0 }` |
| max | 最大值 | `{ type: 'max', max: 100 }` |
| pattern | 正则校验 | `{ type: 'pattern', regex: /^\\d+$/, message: '请输入数字' }` |
| email | 邮箱校验 | `{ type: 'email' }` |
| phone | 手机号校验 | `{ type: 'phone' }` |
| url | URL校验 | `{ type: 'url' }` |
| number | 数字校验 | `{ type: 'number' }` |
| integer | 整数校验 | `{ type: 'integer' }` |
| idCard | 身份证校验 | `{ type: 'idCard' }` |
| username | 用户名校验（3-20位字母数字下划线） | `{ type: 'username' }` |
| password | 密码校验（至少6位） | `{ type: 'password' }` |
| custom | 自定义校验函数 | `{ type: 'custom', validator: (rule, value, callback) => {} }` |

### 校验规则配置示例

```json
{
  "rules": [
    { "type": "required" },
    { "type": "minLength", "min": 6, "message": "至少6个字符" },
    { "type": "email", "message": "请输入正确邮箱" }
  ]
}
```

## 联动逻辑（linkage）

### 级联联动（cascader）

用于省市区等多级联动场景。

```json
{
  "linkage": {
    "cascader": [
      {
        "watchField": "province",
        "targetFields": ["city"],
        "dataMap": {
          "beijing": [{ label: "东城区", value: "dongcheng" }, ...],
          "shanghai": [{ label: "黄浦区", value: "huangpu" }, ...]
        }
      }
    ]
  }
}
```

### 类型-子类型联动（typeSubtype）

用于类别选择联动子类别。

```json
{
  "linkage": {
    "typeSubtype": [
      {
        "typeField": "category",
        "subtypeField": "subCategory",
        "typeSubtypeMap": {
          "electronics": [{ label: "手机", value: "phone" }, ...],
          "clothing": [{ label: "男装", value: "men" }, ...]
        }
      }
    ]
  }
}
```

### 显示隐藏联动（showHide）

根据条件显示或隐藏字段。

```json
{
  "linkage": {
    "showHide": [
      {
        "watchField": "needInvoice",
        "targetField": "invoiceTitle",
        "condition": true
      },
      {
        "watchField": "approvalType",
        "targetField": "amount",
        "condition": ["reimbursement", "purchase"]
      },
      {
        "watchField": "type",
        "targetField": "customField",
        "condition": (val) => val === 'custom'
      }
    ]
  }
}
```

## 动态字段

动态字段支持运行时增删字段，通过设置 `isDynamic` 属性标识。

```json
{
  "fields": [
    {
      "prop": "dynamic_field",
      "label": "动态字段",
      "type": "input",
      "isDynamic": true
    }
  ]
}
```

## 布局配置

### 栅格布局

通过 `layout="grid"` 和 `span` 属性配置多列布局。

```json
{
  "fields": [
    {
      "prop": "name",
      "label": "姓名",
      "type": "input",
      "span": 8
    },
    {
      "prop": "email",
      "label": "邮箱",
      "type": "input",
      "span": 12
    }
  ]
}
```

### 响应式布局

支持响应式断点配置：

| 属性 | 说明 |
|------|------|
| xs | 超小屏幕（<768px） |
| sm | 小屏幕（≥768px） |
| md | 中等屏幕（≥992px） |
| lg | 大屏幕（≥1200px） |
| xl | 超大屏幕（≥1920px） |

## 完整示例

### 基础表单示例

```json
{
  "fields": [
    {
      "prop": "username",
      "label": "用户名",
      "type": "input",
      "placeholder": "请输入用户名",
      "rules": [{ "type": "required" }, { "type": "username" }]
    },
    {
      "prop": "email",
      "label": "邮箱",
      "type": "input",
      "placeholder": "请输入邮箱",
      "rules": [{ "type": "required" }, { "type": "email" }]
    },
    {
      "prop": "role",
      "label": "角色",
      "type": "select",
      "options": [
        { "label": "管理员", "value": "admin" },
        { "label": "普通用户", "value": "user" }
      ],
      "rules": [{ "type": "required" }]
    }
  ]
}
```

### 联动表单示例

```json
{
  "fields": [
    {
      "prop": "province",
      "label": "省份",
      "type": "select",
      "options": [{ "label": "北京市", "value": "beijing" }],
      "rules": [{ "type": "required" }]
    },
    {
      "prop": "city",
      "label": "城市",
      "type": "select",
      "options": [],
      "rules": [{ "type": "required" }]
    },
    {
      "prop": "needInvoice",
      "label": "需要发票",
      "type": "switch"
    },
    {
      "prop": "invoiceTitle",
      "label": "发票抬头",
      "type": "input",
      "visible": false
    }
  ],
  "linkage": {
    "cascader": [
      {
        "watchField": "province",
        "targetFields": ["city"],
        "dataMap": {
          "beijing": [{ "label": "东城区", "value": "dongcheng" }]
        }
      }
    ],
    "showHide": [
      {
        "watchField": "needInvoice",
        "targetField": "invoiceTitle",
        "condition": true
      }
    ]
  }
}
```

## 企业场景应用

### 多级审批表单

```json
{
  "fields": [
    { "prop": "applicant", "label": "申请人", "type": "input", "rules": [{ "type": "required" }] },
    { "prop": "approvalType", "label": "审批类型", "type": "select", "options": [...], "rules": [{ "type": "required" }] },
    { "prop": "leaveType", "label": "请假类型", "type": "select", "options": [...], "visible": false },
    { "prop": "amount", "label": "金额", "type": "number", "visible": false },
    { "prop": "reason", "label": "申请理由", "type": "textarea", "rules": [{ "type": "required" }] },
    { "prop": "attachments", "label": "附件", "type": "upload", "action": "/api/upload" }
  ],
  "linkage": {
    "showHide": [
      { "watchField": "approvalType", "targetField": "leaveType", "condition": "leave" },
      { "watchField": "approvalType", "targetField": "amount", "condition": ["reimbursement", "purchase"] }
    ]
  }
}
```

### 动态表单字段

```json
{
  "fields": [
    { "prop": "items", "label": "商品列表", "type": "slot" }
  ]
}
```

## API 方法

表单生成器组件暴露以下方法：

| 方法 | 说明 | 参数 |
|------|------|------|
| validate | 校验整个表单 | 无 |
| validateField | 校验指定字段 | prop: 字段名 |
| resetFields | 重置表单 | 无 |
| setFormValue | 设置表单值 | data: 对象 |
| getFormValue | 获取表单值 | 无 |
| addField | 添加字段 | field: 字段配置, index: 位置 |
| removeField | 删除字段 | index: 索引 |
| updateField | 更新字段 | prop: 字段名, updates: 更新对象 |
| toggleField | 切换字段显示 | prop: 字段名 |

## 使用示例

```vue
<template>
  <FormGenerator
    ref="formRef"
    :schema="formSchema"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref } from 'vue'
import FormGenerator from '@components/Form/FormGenerator.vue'

const formRef = ref(null)

const formSchema = {
  fields: [
    {
      prop: 'name',
      label: '姓名',
      type: 'input',
      rules: [{ type: 'required' }]
    }
  ]
}

const handleSubmit = (data) => {
  console.log('表单数据:', data)
}
</script>
```