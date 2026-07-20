<template>
  <div class="tags-view">
    <div
      v-for="tag in permissionStore.tagList"
      :key="tag.path"
      :class="['tag-item', { active: tag.path === currentPath }]"
      @click="goPage(tag.path)"
    >
      {{ tag.title }}
      <span v-if="tag.path !== '/dashboard'" class="close-icon" @click.stop="closeTag(tag)">
        ✕
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'

const route = useRoute()
const router = useRouter()
const permissionStore = usePermissionStore()

const currentPath = computed(() => route.path)

const goPage = (path) => {
  router.push(path)
}

const closeTag = (tag) => {
  permissionStore.removeTag(tag.path)
}
</script>

<style lang="scss" scoped>
.tags-view {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 0;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background-color: #f0f2f5;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: #e4e7ed;
  }
  
  &.active {
    background-color: #409eff;
    color: #fff;
  }
  
  .close-icon {
    font-size: 12px;
    opacity: 0.6;
    
    &:hover {
      opacity: 1;
    }
  }
}
</style>