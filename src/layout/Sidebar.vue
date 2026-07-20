<template>
  <aside :class="['sidebar', { collapse: appStore.isCollapse }]">
    <div class="logo">
      <h1>管理系统</h1>
    </div>
    <el-menu
      :default-active="activeMenu"
      mode="vertical"
      background-color="#2b3a4a"
      text-color="#fff"
      active-text-color="#409eff"
      @select="handleMenuSelect"
      :collapse="appStore.isCollapse"
    >
      <template v-for="item in menuList" :key="item.id">
        <el-menu-item v-if="!item.children || item.children.length === 0" :index="`/${item.path}`">
          <el-icon><component :is="getIcon(item.meta.icon)" /></el-icon>
          <template #title>
            <span>{{ item.meta.title }}</span>
            <el-badge v-if="!!item.meta.badge && !appStore.isCollapse" :value="item.meta.badge" class="badge" />
          </template>
        </el-menu-item>
        <el-sub-menu v-else :index="`/${item.path}`" popper-class="sidebar-submenu-popup">
          <template #title>
            <el-icon><component :is="getIcon(item.meta.icon)" /></el-icon>
            <span>{{ item.meta.title }}</span>
            <el-badge v-if="!!item.meta.badge && !appStore.isCollapse" :value="item.meta.badge" class="badge" />
          </template>
          <template v-for="child in item.children" :key="child.id">
            <el-menu-item v-if="!child.children || child.children.length === 0" :index="`/${item.path}/${child.path}`">
              <el-icon v-if="child.meta.icon"><component :is="getIcon(child.meta.icon)" /></el-icon>
              <template #title>
                <span>{{ child.meta.title }}</span>
                <el-badge v-if="!!child.meta.badge" :value="child.meta.badge" class="badge sub-badge" />
              </template>
            </el-menu-item>
            <el-sub-menu v-else :index="`/${item.path}/${child.path}`">
              <template #title>
                <el-icon v-if="child.meta.icon"><component :is="getIcon(child.meta.icon)" /></el-icon>
                <span>{{ child.meta.title }}</span>
              </template>
              <el-menu-item
                v-for="subChild in child.children"
                :key="subChild.id"
                :index="`/${item.path}/${child.path}/${subChild.path}`"
              >
                <template #title>{{ subChild.meta.title }}</template>
              </el-menu-item>
            </el-sub-menu>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HomeFilled as Home, User, Setting, Document, Lock, PieChart, EditPen as Form, Histogram, MapLocation, Grid, DataAnalysis } from '@element-plus/icons-vue'
import { usePermissionStore } from '@store/modules/permission'
import { useAppStore } from '@store/modules/app'

const route = useRoute()
const router = useRouter()
const permissionStore = usePermissionStore()
const appStore = useAppStore()

const activeMenu = computed(() => route.path)

const menuList = computed(() => permissionStore.menuList)

const iconMap = { Home, User, Setting, List: Document, Plus: Document, Lock, PieChart, Form, Histogram, Map: MapLocation, Table: Grid, DataAnalysis, DataBoard: DataAnalysis, DataLine: DataAnalysis }

const getIcon = (iconName) => iconMap[iconName] || Document

const handleMenuSelect = (index) => router.push(index)
</script>

<style lang="scss" scoped>
.sidebar {
  width: 220px;
  background-color: #2b3a4a;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  
  &.collapse {
    width: 66px;
    .logo h1 { font-size: 0; }
  }
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #3a4a5a;
  
  h1 {
    color: #fff;
    font-size: 18px;
    margin: 0;
    transition: font-size 0.3s;
  }
}

:deep(.el-menu) { border-right: none; flex: 1; overflow-y: auto; }

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  overflow: hidden;
  * { vertical-align: top; }
}

.badge { margin-left: 8px; }

.sidebar.collapse {
  :deep(.el-badge) {
    display: none;
  }
}
</style>

<style>
/* 收起状态下，子菜单徽标定位到文字右上方，和展开时一致 */
.sidebar.collapse .el-menu--inline .sub-badge {
  position: relative;
  margin-left: 8px;
  height: auto;
  line-height: 1;
}

/* 弹出式子菜单徽标定位到文字右上方 */
.el-menu--popup .sub-badge {
  position: relative;
  margin-left: 8px;
  height: auto;
  line-height: 1;
}
</style>