<template>
  <div class="form-demo">
    <el-card>
      <h2>表单生成器演示</h2>
      
      <div class="demo-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基础表单" name="basic">
            <FormGenerator
              :schema="basicSchema"
              @submit="handleBasicSubmit"
              @change="handleChange"
            />
          </el-tab-pane>
          
          <el-tab-pane label="联动表单" name="linkage">
            <FormGenerator
              :schema="linkageSchema"
              @submit="handleLinkageSubmit"
              @change="handleChange"
            />
          </el-tab-pane>
          
          <el-tab-pane label="动态字段" name="dynamic">
            <div class="dynamic-controls">
              <el-button type="primary" @click="addDynamicField">添加字段</el-button>
              <el-button type="danger" @click="removeLastField">删除最后字段</el-button>
              <el-button @click="toggleField('customField')">切换字段显示</el-button>
            </div>
            <FormGenerator
              ref="dynamicFormRef"
              :schema="dynamicSchema"
              @submit="handleDynamicSubmit"
              @change="handleChange"
            />
          </el-tab-pane>
          
          <el-tab-pane label="栅格布局" name="grid">
            <FormGenerator
              :schema="gridSchema"
              layout="grid"
              :gutter="24"
              @submit="handleGridSubmit"
              @change="handleChange"
            />
          </el-tab-pane>
          
          <el-tab-pane label="多级审批" name="approval">
            <FormGenerator
              :schema="approvalSchema"
              @submit="handleApprovalSubmit"
              @change="handleChange"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <div class="form-result" v-if="formResult">
        <h3>表单数据:</h3>
        <pre>{{ JSON.stringify(formResult, null, 2) }}</pre>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import FormGenerator from '@components/Form/FormGenerator.vue'

const activeTab = ref('basic')
const formResult = ref(null)
const dynamicFormRef = ref(null)

const basicSchema = {
  fields: [
    {
      prop: 'username',
      label: '用户名',
      type: 'input',
      placeholder: '请输入用户名',
      rules: [
        { type: 'required' },
        { type: 'username' }
      ]
    },
    {
      prop: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '请输入邮箱',
      rules: [
        { type: 'required' },
        { type: 'email' }
      ]
    },
    {
      prop: 'phone',
      label: '手机号',
      type: 'input',
      placeholder: '请输入手机号',
      rules: [
        { type: 'phone' }
      ]
    },
    {
      prop: 'role',
      label: '角色',
      type: 'select',
      placeholder: '请选择角色',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
        { label: '访客', value: 'guest' }
      ],
      rules: [
        { type: 'required' }
      ]
    },
    {
      prop: 'department',
      label: '部门',
      type: 'select',
      placeholder: '请选择部门',
      options: [
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '运营部', value: 'operation' },
        { label: '销售部', value: 'sales' }
      ],
      rules: [
        { type: 'required' }
      ]
    },
    {
      prop: 'status',
      label: '状态',
      type: 'radio',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'disabled' }
      ],
      default: 'active'
    },
    {
      prop: 'tags',
      label: '标签',
      type: 'checkbox',
      options: [
        { label: 'VIP', value: 'vip' },
        { label: '新用户', value: 'new' },
        { label: '活跃', value: 'active' }
      ],
      default: []
    },
    {
      prop: 'description',
      label: '描述',
      type: 'textarea',
      placeholder: '请输入描述',
      rows: 3
    },
    {
      prop: 'birthDate',
      label: '出生日期',
      type: 'date',
      placeholder: '请选择出生日期'
    },
    {
      prop: 'score',
      label: '评分',
      type: 'number',
      min: 0,
      max: 100,
      step: 1
    }
  ]
}

const provinces = [
  { label: '北京市', value: 'beijing' },
  { label: '上海市', value: 'shanghai' },
  { label: '广东省', value: 'guangdong' }
]

const cities = {
  beijing: [
    { label: '东城区', value: 'dongcheng' },
    { label: '西城区', value: 'xicheng' },
    { label: '朝阳区', value: 'chaoyang' }
  ],
  shanghai: [
    { label: '黄浦区', value: 'huangpu' },
    { label: '徐汇区', value: 'xuhui' },
    { label: '浦东新区', value: 'pudong' }
  ],
  guangdong: [
    { label: '广州市', value: 'guangzhou' },
    { label: '深圳市', value: 'shenzhen' },
    { label: '东莞市', value: 'dongguan' }
  ]
}

const areas = {
  dongcheng: [{ label: '王府井', value: 'wangfujing' }, { label: '天安门', value: 'tiananmen' }],
  xicheng: [{ label: '西单', value: 'xidan' }, { label: '金融街', value: 'jinrongjie' }],
  chaoyang: [{ label: '三里屯', value: 'sanlitun' }, { label: '望京', value: 'wangjing' }],
  huangpu: [{ label: '外滩', value: 'waitan' }, { label: '人民广场', value: 'people' }],
  xuhui: [{ label: '徐家汇', value: 'xujiahui' }, { label: '漕河泾', value: 'caohejing' }],
  pudong: [{ label: '陆家嘴', value: 'lujiazui' }, { label: '张江', value: 'zhangjiang' }],
  guangzhou: [{ label: '天河', value: 'tianhe' }, { label: '越秀', value: 'yuexiu' }],
  shenzhen: [{ label: '南山', value: 'nanshan' }, { label: '福田', value: 'futian' }],
  dongguan: [{ label: '东城', value: 'dongcheng' }, { label: '南城', value: 'nancheng' }]
}

const categoryOptions = [
  { label: '电子产品', value: 'electronics' },
  { label: '服装', value: 'clothing' },
  { label: '食品', value: 'food' }
]

const subCategoryOptions = {
  electronics: [
    { label: '手机', value: 'phone' },
    { label: '电脑', value: 'computer' },
    { label: '平板', value: 'tablet' }
  ],
  clothing: [
    { label: '男装', value: 'men' },
    { label: '女装', value: 'women' },
    { label: '童装', value: 'kids' }
  ],
  food: [
    { label: '零食', value: 'snack' },
    { label: '饮料', value: 'drink' },
    { label: '生鲜', value: 'fresh' }
  ]
}

const linkageSchema = {
  fields: [
    {
      prop: 'province',
      label: '省份',
      type: 'select',
      placeholder: '请选择省份',
      options: provinces,
      rules: [{ type: 'required' }]
    },
    {
      prop: 'city',
      label: '城市',
      type: 'select',
      placeholder: '请选择城市',
      options: [],
      rules: [{ type: 'required' }]
    },
    {
      prop: 'area',
      label: '区域',
      type: 'select',
      placeholder: '请选择区域',
      options: [],
      rules: [{ type: 'required' }]
    },
    {
      prop: 'category',
      label: '商品类别',
      type: 'select',
      placeholder: '请选择商品类别',
      options: categoryOptions,
      rules: [{ type: 'required' }]
    },
    {
      prop: 'subCategory',
      label: '子类别',
      type: 'select',
      placeholder: '请选择子类别',
      options: [],
      rules: [{ type: 'required' }]
    },
    {
      prop: 'needInvoice',
      label: '需要发票',
      type: 'switch',
      default: false
    },
    {
      prop: 'invoiceTitle',
      label: '发票抬头',
      type: 'input',
      placeholder: '请输入发票抬头',
      visible: false,
      rules: [{ type: 'required' }]
    }
  ],
  linkage: {
    cascader: [
      { watchField: 'province', targetFields: ['city'], dataMap: cities },
      { watchField: 'city', targetFields: ['area'], dataMap: areas }
    ],
    typeSubtype: [
      { typeField: 'category', subtypeField: 'subCategory', typeSubtypeMap: subCategoryOptions }
    ],
    showHide: [
      { watchField: 'needInvoice', targetField: 'invoiceTitle', condition: (val) => val === true }
    ]
  }
}

const dynamicFields = reactive([
  {
    prop: 'name',
    label: '姓名',
    type: 'input',
    placeholder: '请输入姓名',
    rules: [{ type: 'required' }]
  },
  {
    prop: 'email',
    label: '邮箱',
    type: 'input',
    placeholder: '请输入邮箱',
    rules: [{ type: 'email' }]
  },
  {
    prop: 'customField',
    label: '自定义字段',
    type: 'input',
    placeholder: '动态显示的字段',
    visible: true
  }
])

const dynamicSchema = {
  fields: dynamicFields
}

const gridSchema = {
  fields: [
    {
      prop: 'firstName',
      label: '名',
      type: 'input',
      placeholder: '请输入名',
      span: 8,
      rules: [{ type: 'required' }]
    },
    {
      prop: 'lastName',
      label: '姓',
      type: 'input',
      placeholder: '请输入姓',
      span: 8,
      rules: [{ type: 'required' }]
    },
    {
      prop: 'gender',
      label: '性别',
      type: 'select',
      placeholder: '请选择性别',
      span: 8,
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '其他', value: 'other' }
      ],
      rules: [{ type: 'required' }]
    },
    {
      prop: 'email',
      label: '邮箱',
      type: 'input',
      placeholder: '请输入邮箱',
      span: 12,
      rules: [{ type: 'required' }, { type: 'email' }]
    },
    {
      prop: 'phone',
      label: '手机号',
      type: 'input',
      placeholder: '请输入手机号',
      span: 12,
      rules: [{ type: 'phone' }]
    },
    {
      prop: 'department',
      label: '部门',
      type: 'select',
      placeholder: '请选择部门',
      span: 8,
      options: [
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '运营部', value: 'operation' }
      ],
      rules: [{ type: 'required' }]
    },
    {
      prop: 'position',
      label: '职位',
      type: 'select',
      placeholder: '请选择职位',
      span: 8,
      options: [
        { label: '经理', value: 'manager' },
        { label: '主管', value: 'supervisor' },
        { label: '员工', value: 'staff' }
      ],
      rules: [{ type: 'required' }]
    },
    {
      prop: 'hireDate',
      label: '入职日期',
      type: 'date',
      placeholder: '请选择入职日期',
      span: 8,
      rules: [{ type: 'required' }]
    }
  ]
}

const approvalSchema = {
  fields: [
    {
      prop: 'applicant',
      label: '申请人',
      type: 'input',
      placeholder: '请输入申请人姓名',
      rules: [{ type: 'required' }]
    },
    {
      prop: 'applicantDept',
      label: '申请部门',
      type: 'select',
      placeholder: '请选择申请部门',
      options: [
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '运营部', value: 'operation' },
        { label: '财务部', value: 'finance' }
      ],
      rules: [{ type: 'required' }]
    },
    {
      prop: 'approvalType',
      label: '审批类型',
      type: 'select',
      placeholder: '请选择审批类型',
      options: [
        { label: '请假', value: 'leave' },
        { label: '报销', value: 'reimbursement' },
        { label: '采购', value: 'purchase' },
        { label: '入职', value: 'onboarding' }
      ],
      rules: [{ type: 'required' }]
    },
    {
      prop: 'leaveType',
      label: '请假类型',
      type: 'select',
      placeholder: '请选择请假类型',
      options: [
        { label: '事假', value: 'personal' },
        { label: '病假', value: 'sick' },
        { label: '年假', value: 'annual' },
        { label: '婚假', value: 'marriage' }
      ],
      visible: false,
      rules: [{ type: 'required' }]
    },
    {
      prop: 'startDate',
      label: '开始日期',
      type: 'date',
      placeholder: '请选择开始日期',
      rules: [{ type: 'required' }]
    },
    {
      prop: 'endDate',
      label: '结束日期',
      type: 'date',
      placeholder: '请选择结束日期',
      rules: [{ type: 'required' }]
    },
    {
      prop: 'amount',
      label: '金额',
      type: 'number',
      placeholder: '请输入金额',
      visible: false,
      min: 0,
      step: 0.01,
      rules: [{ type: 'required' }, { type: 'min', min: 0 }]
    },
    {
      prop: 'reason',
      label: '申请理由',
      type: 'textarea',
      placeholder: '请输入申请理由',
      rows: 4,
      rules: [{ type: 'required' }, { type: 'minLength', min: 10 }]
    },
    {
      prop: 'attachments',
      label: '附件',
      type: 'upload',
      action: '/api/upload',
      tips: '支持上传图片、文档等附件',
      multiple: true
    },
    {
      prop: 'urgent',
      label: '紧急',
      type: 'switch',
      default: false
    }
  ],
  linkage: {
    showHide: [
      { watchField: 'approvalType', targetField: 'leaveType', condition: (val) => val === 'leave' },
      { watchField: 'approvalType', targetField: 'amount', condition: (val) => ['reimbursement', 'purchase'].includes(val) }
    ]
  }
}

const addDynamicField = () => {
  const newField = {
    prop: `dynamic_${Date.now()}`,
    label: `动态字段 ${dynamicFields.length + 1}`,
    type: 'input',
    placeholder: '请输入内容',
    isDynamic: true
  }
  dynamicFields.push(newField)
}

const removeLastField = () => {
  const dynamicIndex = dynamicFields.findIndex(f => f.isDynamic)
  if (dynamicIndex > -1) {
    dynamicFields.splice(dynamicIndex, 1)
  } else if (dynamicFields.length > 2) {
    dynamicFields.pop()
  }
}

const toggleField = (prop) => {
  const field = dynamicFields.find(f => f.prop === prop)
  if (field) {
    field.visible = !field.visible
  }
}

const handleBasicSubmit = (data) => {
  formResult.value = data
  ElMessage.success('基础表单提交成功')
}

const handleLinkageSubmit = (data) => {
  formResult.value = data
  ElMessage.success('联动表单提交成功')
}

const handleDynamicSubmit = (data) => {
  formResult.value = data
  ElMessage.success('动态字段表单提交成功')
}

const handleGridSubmit = (data) => {
  formResult.value = data
  ElMessage.success('栅格布局表单提交成功')
}

const handleApprovalSubmit = (data) => {
  formResult.value = data
  ElMessage.success('审批表单提交成功')
}

const handleChange = ({ prop, value }) => {
  console.log(`字段 ${prop} 变化:`, value)
}
</script>

<style lang="scss" scoped>
.form-demo {
  .demo-tabs {
    margin-top: 20px;
  }

  .dynamic-controls {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }

  .form-result {
    margin-top: 30px;
    padding: 20px;
    background-color: #f5f7fa;
    border-radius: 8px;

    h3 {
      margin: 0 0 12px 0;
      font-size: 16px;
      color: #303133;
    }

    pre {
      margin: 0;
      padding: 12px;
      background-color: #fff;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>