<template>
  <div class="app-container">
    <Sidebar />
    <div :class="['main-content', { 'sidebar-collapse': appStore.isCollapse }]">
      <Header />
      <div class="app-main">
        <Breadcrumb />
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import Breadcrumb from './Breadcrumb.vue'

const appStore = useAppStore()
const permissionStore = usePermissionStore()

const cachedViews = computed(() => {
  return permissionStore.cachedViews
})
</script>

<style lang="scss" scoped>
.app-container {
  height: 100vh;
  overflow: hidden;
}

.main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  overflow: hidden;
  transition: padding-left 0.3s;
  padding-left: 220px;
  
  &.sidebar-collapse {
    padding-left: 64px;
  }
}

.app-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>