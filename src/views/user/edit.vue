<template>
  <div class="user-edit">
    <el-card>
      <div class="card-header">
        <h2>编辑用户</h2>
        <el-button @click="handleBack">返回</el-button>
      </div>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="edit-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" disabled />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="不修改密码请留空" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
            <el-option label="访客" value="guest" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="form.department" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="'active'" :inactive-value="'disabled'" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)

const userList = [
  { id: 1, username: 'admin', name: '管理员', email: 'admin@example.com', role: 'admin', department: '技术部', status: 'active' },
  { id: 2, username: 'zhangsan', name: '张三', email: 'zhangsan@example.com', role: 'user', department: '产品部', status: 'active' },
  { id: 3, username: 'lisi', name: '李四', email: 'lisi@example.com', role: 'user', department: '运营部', status: 'active' },
  { id: 4, username: 'wangwu', name: '王五', email: 'wangwu@example.com', role: 'guest', department: '市场部', status: 'disabled' },
  { id: 5, username: 'zhaoliu', name: '赵六', email: 'zhaoliu@example.com', role: 'user', department: '销售部', status: 'active' },
  { id: 6, username: 'sunqi', name: '孙七', email: 'sunqi@example.com', role: 'user', department: '财务部', status: 'active' },
  { id: 7, username: 'zhouba', name: '周八', email: 'zhouba@example.com', role: 'guest', department: '人力资源部', status: 'disabled' },
  { id: 8, username: 'wujiu', name: '吴九', email: 'wujiu@example.com', role: 'admin', department: '技术部', status: 'active' }
]

const form = reactive({
  id: '',
  username: '',
  password: '',
  email: '',
  role: '',
  department: '',
  status: 'active'
})

const rules = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '请输入正确邮箱', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  department: [{ required: true, message: '请输入部门', trigger: 'blur' }]
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    ElMessage.success('修改成功')
    router.push('/user/list')
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleCancel = () => {
  router.push('/user/list')
}

const handleBack = () => {
  router.push('/user/list')
}

onMounted(() => {
  const userId = parseInt(route.params.id)
  const user = userList.find(u => u.id === userId)
  if (user) {
    form.id = user.id
    form.username = user.username
    form.email = user.email
    form.role = user.role
    form.department = user.department
    form.status = user.status
  }
})
</script>

<style lang="scss" scoped>
.user-edit {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 20px;
      color: #303133;
    }
  }

  .edit-form {
    max-width: 500px;
  }
}
</style>