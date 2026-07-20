<template>
  <div class="permission-settings">
    <el-card>
      <h2>权限管理</h2>
      <el-table :data="roles" border stripe>
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="permissions" label="权限列表">
          <template #default="scope">
            <el-tag v-for="perm in scope.row.permissions" :key="perm" size="small">{{ perm }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const roles = ref([
  { name: 'admin', description: '管理员', permissions: ['user:list', 'user:add', 'user:edit', 'user:delete', 'settings:view', 'settings:edit'] },
  { name: 'user', description: '普通用户', permissions: ['user:profile'] },
  { name: 'guest', description: '访客', permissions: [] }
])

const handleEdit = (row) => {
  ElMessage.info(`编辑角色: ${row.name}`)
}
</script>

<style lang="scss" scoped>
.permission-settings {
}
</style>