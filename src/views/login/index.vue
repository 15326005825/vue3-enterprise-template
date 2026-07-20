<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>管理系统</h1>
        <p>欢迎回来，请登录</p>
      </div>
      <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="10">
            <el-col :span="16">
              <el-input
                v-model="form.code"
                placeholder="验证码"
                prefix-icon="Code"
                size="large"
              />
            </el-col>
            <el-col :span="8">
              <div class="code-img" @click="refreshCode">
                <span>{{ captchaCode }}</span>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item class="login-options">
          <el-checkbox v-model="form.remember">记住密码</el-checkbox>
          <a href="#" class="forgot-password">忘记密码？</a>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" class="login-btn" @click="handleLogin" :loading="loading">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@store/modules/user'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)
const captchaCode = ref('')

const form = reactive({
  username: '',
  password: '',
  code: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
}

const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

const refreshCode = () => {
  captchaCode.value = generateCode()
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (form.code.toLowerCase() !== captchaCode.value.toLowerCase()) {
      ElMessage.error('验证码错误')
      refreshCode()
      return
    }
    
    loading.value = true
    const result = await userStore.login(form)
    
    if (result.code === 200) {
      ElMessage.success('登录成功')
      router.push('/dashboard')
    } else {
      ElMessage.error(result.message || '登录失败')
      refreshCode()
    }
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    }
    refreshCode()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refreshCode()
  const savedUser = localStorage.getItem('remembered_user')
  if (savedUser) {
    const user = JSON.parse(savedUser)
    form.username = user.username
    form.password = user.password
    form.remember = true
  }
})
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  background-color: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
  
  h1 {
    font-size: 28px;
    color: #303133;
    margin: 0 0 8px 0;
  }
  
  p {
    color: #909399;
    margin: 0;
  }
}

.login-form {
  .login-btn {
    width: 100%;
  }
  
  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .forgot-password {
      color: #409eff;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .code-img {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 4px;
    cursor: pointer;
    user-select: none;
  }
}
</style>