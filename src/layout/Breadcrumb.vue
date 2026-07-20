<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <template v-for="(item, index) in breadcrumbList" :key="index">
        <el-breadcrumb-item v-if="index === breadcrumbList.length - 1">
          {{ item.title }}
        </el-breadcrumb-item>
        <el-breadcrumb-item v-else :to="{ path: item.path }">
          {{ item.title }}
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePermissionStore } from '@store/modules/permission'

const route = useRoute()
const permissionStore = usePermissionStore()

const breadcrumbList = computed(() => {
  const matched = route.matched
  const list = []
  
  matched.forEach(item => {
    if (item.meta && item.meta.title && item.meta.title !== '首页') {
      list.push({
        path: item.path,
        title: item.meta.title
      })
    }
  })
  
  return list
})
</script>

<style scoped>
.breadcrumb {
  padding: 10px 0;
}
</style>