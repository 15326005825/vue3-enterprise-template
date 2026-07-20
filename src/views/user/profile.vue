<template>
  <div class="profile">
    <el-card>
      <div class="card-header">
        <h2>个人中心</h2>
        <el-button @click="handleBack">返回</el-button>
      </div>
      <div class="profile-header">
        <div class="avatar">
          <el-avatar :size="100" icon="User" />
        </div>
        <div class="user-info">
          <h2>{{ userStore.user.name }}</h2>
          <p>{{ userStore.user.email }}</p>
          <el-tag>{{ userStore.user.roles.join(', ') }}</el-tag>
        </div>
      </div>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="info">
          <el-form :model="form" :rules="infoRules" ref="infoFormRef" label-width="100px" class="profile-form">
            <el-form-item label="用户名">
              <el-input :value="userStore.user.name" disabled />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item label="部门" prop="department">
              <el-input v-model="form.department" />
            </el-form-item>
            <el-form-item label="角色">
              <el-tag>{{ userStore.user.roles.join(', ') }}</el-tag>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSave">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="修改密码" name="password">
          <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px" class="profile-form">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleChangePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@store/modules/user'

const userStore = useUserStore()
const router = useRouter()

const activeTab = ref('info')
const infoFormRef = ref(null)
const passwordFormRef = ref(null)

const form = reactive({
  email: userStore.user.email,
  department: userStore.user.department || ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const infoRules = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '请输入正确邮箱', trigger: 'blur' }],
  department: [{ required: true, message: '请输入部门', trigger: 'blur' }]
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, message: '密码至少6位', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value !== passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ]
}

const handleSave = async () => {
  try {
    await infoFormRef.value.validate()
    userStore.updateUserInfo({ email: form.email, department: form.department })
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleChangePassword = async () => {
  try {
    await passwordFormRef.value.validate()
    ElMessage.success('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleBack = () => {
  router.push('/dashboard')
}
</script>

<style lang="scss" scoped>
.profile {
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

  .profile-header {
    display: flex;
    align-items: center;
    gap: 30px;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e4e7ed;
    
    .avatar {
      flex-shrink: 0;
    }
    
    .user-info {
      h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
      }
      
      p {
        margin: 0 0 12px 0;
        color: #909399;
      }
    }
  }
  
  .profile-form {
    max-width: 500px;
  }
}
</style>