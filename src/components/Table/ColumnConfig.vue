<template>
  <el-dialog
    v-model="visible"
    title="列配置"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="column-config">
      <div class="config-tips">
        <el-icon class="tips-icon"><InfoFilled /></el-icon>
        <span>拖动列项调整显示顺序，勾选控制列的显示/隐藏</span>
      </div>

      <div class="column-list">
        <div
          v-for="(column, index) in localColumns"
          :key="column.prop"
          class="column-item"
          draggable="true"
          @dragstart="handleDragStart($event, index)"
          @dragover.prevent
          @drop="handleDrop($event, index)"
        >
          <div class="drag-handle">
            <el-icon><Menu /></el-icon>
          </div>

          <el-checkbox
            v-model="column.visible"
            :disabled="column.fixed"
          >
            {{ column.label || column.prop }}
          </el-checkbox>

          <div class="column-actions">
            <el-button
              size="small"
              :type="column.fixed === 'left' ? 'primary' : 'default'"
              @click="toggleFixed(column, 'left')"
            >
              左固定
            </el-button>
            <el-button
              size="small"
              :type="column.fixed === 'right' ? 'primary' : 'default'"
              @click="toggleFixed(column, 'right')"
            >
              右固定
            </el-button>
          </div>
        </div>
      </div>

      <div class="config-actions">
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { InfoFilled, Menu } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'update'])

const visible = ref(false)
const localColumns = ref([])
const backupColumns = ref([])
const draggingIndex = ref(-1)

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    localColumns.value = JSON.parse(JSON.stringify(props.columns))
    backupColumns.value = JSON.parse(JSON.stringify(props.columns))
  }
})

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleDragStart = (event, index) => {
  draggingIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
}

const handleDrop = (event, index) => {
  if (draggingIndex.value !== -1 && draggingIndex.value !== index) {
    const draggedItem = localColumns.value.splice(draggingIndex.value, 1)[0]
    localColumns.value.splice(index, 0, draggedItem)
  }
  draggingIndex.value = -1
}

const toggleFixed = (column, position) => {
  if (column.fixed === position) {
    column.fixed = false
  } else {
    column.fixed = position
  }
}

const handleReset = () => {
  localColumns.value = JSON.parse(JSON.stringify(backupColumns.value))
}

const handleConfirm = () => {
  emit('update', localColumns.value)
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
.column-config {
  .config-tips {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background-color: #f5f7fa;
    border-radius: 6px;
    margin-bottom: 16px;
    font-size: 14px;
    color: #606266;

    .tips-icon {
      color: #409eff;
    }
  }

  .column-list {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 8px;
  }

  .column-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    margin-bottom: 8px;
    background-color: #fafafa;
    border-radius: 6px;
    cursor: move;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f0f2f5;
    }

    &:active {
      opacity: 0.6;
    }
  }

  .drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: #909399;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  .column-actions {
    margin-left: auto;
    display: flex;
    gap: 4px;
  }

  .config-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #eee;
  }
}
</style>