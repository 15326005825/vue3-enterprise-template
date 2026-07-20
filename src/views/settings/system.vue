<template>
  <div class="system-settings">
    <el-card>
      <h2>系统配置</h2>
      <el-form :model="settings" label-width="150px" class="settings-form">
        <el-form-item label="系统名称">
          <el-input v-model="settings.systemName" />
        </el-form-item>
        <el-form-item label="系统描述">
          <el-input v-model="settings.systemDesc" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="系统Logo">
          <el-upload :show-file-list="false">
            <el-button size="small" type="primary">上传Logo</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否开启注册">
          <el-switch v-model="settings.enableRegister" />
        </el-form-item>
        <el-form-item label="是否开启验证码">
          <el-switch v-model="settings.enableCaptcha" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const settings = reactive({
  systemName: '管理系统',
  systemDesc: '企业级后台管理系统',
  enableRegister: true,
  enableCaptcha: true
})

const handleSave = () => {
  ElMessage.success('配置保存成功')
}
</script>

<style lang="scss" scoped>
.system-settings {
  .settings-form {
    max-width: 600px;
  }
}
</style>