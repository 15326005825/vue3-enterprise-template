<template>
  <header class="header">
    <div class="header-left">
      <!-- <el-button icon="Menu" @click="toggleSidebar" /> -->
	  <el-button @click="toggleSidebar">{{ appStore.isCollapse ? '展开' : '收起' }}</el-button>
      <TagsView />
    </div>
    <div class="header-right">
      <el-dropdown trigger="click">
        <span class="user-info">
          <el-avatar :size="32" :src="userStore.user.avatar">
            {{ userStore.user.name?.charAt(0) }}
          </el-avatar>
          <span>{{ userStore.user.name }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goProfile">个人中心</el-dropdown-item>
            <el-dropdown-item @click="goSettings">系统设置</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@store/modules/user'
import { useAppStore } from '@store/modules/app'
import TagsView from './TagsView.vue'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

const toggleSidebar = () => {
  appStore.toggleCollapse()
}

const goProfile = () => {
  router.push('/user/profile')
}

const goSettings = () => {
  router.push('/settings/system')
}

const handleLogout = async () => {
  await userStore.logout()
}
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
</style>