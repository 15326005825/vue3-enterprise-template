<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-icon">404</div>
      <h1>页面不存在</h1>
      <p>您访问的页面不存在或暂无权限</p>
      <el-button type="primary" @click="goBack">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/dashboard')
}
</script>

<style lang="scss" scoped>
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.error-content {
  text-align: center;
  
  .error-icon {
    font-size: 120px;
    font-weight: bold;
    color: #409eff;
    margin-bottom: 20px;
  }
  
  h1 {
    font-size: 32px;
    color: #303133;
    margin: 0 0 16px 0;
  }
  
  p {
    color: #909399;
    margin: 0 0 32px 0;
    font-size: 16px;
  }
}
</style>