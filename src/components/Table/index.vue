<template>
  <div class="advanced-table">
    <div class="table-toolbar" v-if="showToolbar">
      <div class="toolbar-left">
        <el-button
          type="primary"
          icon="Plus"
          size="small"
          v-if="showAddBtn"
          @click="handleAdd"
        >
          添加
        </el-button>
        <el-button
          type="danger"
          icon="Delete"
          size="small"
          :disabled="selectedRows.length === 0"
          v-if="showBatchDeleteBtn"
          @click="handleBatchDelete"
        >
          批量删除
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-button
          icon="Download"
          size="small"
          v-if="showExportBtn"
          @click="handleExport"
        >
          导出Excel
        </el-button>
        <el-button
          icon="Setting"
          size="small"
          v-if="showColumnConfigBtn"
          @click="showColumnConfig = true"
        >
          列配置
        </el-button>
      </div>
    </div>

    <div class="table-filter" v-if="filterForm && Object.keys(filterForm).length > 0">
      <el-form :model="filterForm" inline size="small">
        <template v-for="(value, key) in filterForm" :key="key">
          <el-form-item :label="getFilterLabel(key)">
            <el-input
              v-if="filterType[key] === 'input' || !filterType[key]"
              v-model="filterForm[key]"
              placeholder="请输入"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-select
              v-else-if="filterType[key] === 'select'"
              v-model="filterForm[key]"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="option in filterOptions[key]"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-date-picker
              v-else-if="filterType[key] === 'date'"
              v-model="filterForm[key]"
              type="date"
              placeholder="选择日期"
              clearable
            />
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleFilter">搜索</el-button>
          <el-button size="small" @click="handleResetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-table
        :data="tableData"
        :loading="loading"
        :border="border"
        :stripe="stripe"
        :highlight-current-row="highlightCurrentRow"
        :row-key="rowKey"
        :tree-props="treeProps"
        :default-expand-all="defaultExpandAll"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        class="main-table"
      >
        <el-table-column
          v-if="showSelection"
          type="selection"
          :width="selectionWidth"
          :reserve-selection="reserveSelection"
        />

        <el-table-column
          v-if="showIndex"
          type="index"
          :width="indexWidth"
          label="序号"
          align="center"
        />

        <template v-for="column in visibleColumns" :key="column.prop">
          <el-table-column
            v-if="column.children"
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :fixed="column.fixed"
            :align="column.align || 'center'"
          >
            <el-table-column
              v-for="child in column.children"
              :key="child.prop"
              :prop="child.prop"
              :label="child.label"
              :width="child.width"
              :align="child.align || 'center'"
            >
              <template #default="scope">
                <slot :name="`custom-${child.prop}`" :row="scope.row">
                  <span v-if="child.formatter">{{ child.formatter(scope.row) }}</span>
                  <span v-else>{{ scope.row[child.prop] }}</span>
                </slot>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column
            v-else
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :fixed="column.fixed"
            :align="column.align || 'center'"
            :sortable="column.sortable"
            :filters="column.filters"
            :filter-method="column.filterMethod"
          >
            <template #default="scope">
              <template v-if="editableRows.includes(scope.row[rowKey]) && column.editable">
                <el-input
                  v-if="column.editType === 'input'"
                  v-model="scope.row[column.prop]"
                  size="small"
                  @blur="handleEditBlur(scope.row, column.prop)"
                  @keyup.enter="handleEditBlur(scope.row, column.prop)"
                />
                <el-select
                  v-else-if="column.editType === 'select'"
                  v-model="scope.row[column.prop]"
                  size="small"
                  @blur="handleEditBlur(scope.row, column.prop)"
                >
                  <el-option
                    v-for="option in column.editOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </template>
              <template v-else>
                <slot :name="`custom-${column.prop}`" :row="scope.row">
                  <span v-if="column.formatter">{{ column.formatter(scope.row) }}</span>
                  <span v-else>{{ scope.row[column.prop] }}</span>
                </slot>
              </template>
            </template>
          </el-table-column>
        </template>

        <el-table-column
          v-if="showActions"
          label="操作"
          :width="actionsWidth"
          :fixed="actionsFixed"
          align="center"
        >
          <template #default="scope">
            <template v-if="editableRows.includes(scope.row[rowKey])">
              <el-button size="small" type="primary" @click="handleSaveEdit(scope.row)">保存</el-button>
              <el-button size="small" @click="handleCancelEdit(scope.row)">取消</el-button>
            </template>
            <template v-else>
              <slot name="actions" :row="scope.row">
                <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </slot>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      v-if="showPagination && total > 0"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :layout="paginationLayout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="pagination"
    />

    <ColumnConfig
      v-if="showColumnConfigBtn"
      v-model="showColumnConfig"
      :columns="columns"
      @update="handleColumnUpdate"
    />
  </div>
</template>

<script setup>import { ref, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import ColumnConfig from './ColumnConfig.vue';
import { exportToExcel } from '@utils/export';
const props = defineProps({
 tableData: {
 type: Array,
 default: () => []
 },
 loading: {
 type: Boolean,
 default: false
 },
 columns: {
 type: Array,
 default: () => []
 },
 total: {
 type: Number,
 default: 0
 },
 currentPage: {
 type: Number,
 default: 1
 },
 pageSize: {
 type: Number,
 default: 10
 },
 pageSizes: {
 type: Array,
 default: () => [10, 20, 50, 100]
 },
 paginationLayout: {
 type: String,
 default: 'total, sizes, prev, pager, next, jumper'
 },
 showSelection: {
 type: Boolean,
 default: false
 },
 selectionWidth: {
 type: Number,
 default: 55
 },
 reserveSelection: {
 type: Boolean,
 default: false
 },
 showIndex: {
 type: Boolean,
 default: false
 },
 indexWidth: {
 type: Number,
 default: 60
 },
 showActions: {
 type: Boolean,
 default: false
 },
 actionsWidth: {
 type: Number,
 default: 150
 },
 actionsFixed: {
 type: String,
 default: 'right'
 },
 showPagination: {
 type: Boolean,
 default: true
 },
 showToolbar: {
 type: Boolean,
 default: true
 },
 showAddBtn: {
 type: Boolean,
 default: false
 },
 showBatchDeleteBtn: {
 type: Boolean,
 default: false
 },
 showExportBtn: {
 type: Boolean,
 default: false
 },
 showColumnConfigBtn: {
 type: Boolean,
 default: false
 },
 border: {
 type: Boolean,
 default: false
 },
 stripe: {
 type: Boolean,
 default: true
 },
 highlightCurrentRow: {
 type: Boolean,
 default: false
 },
 rowKey: {
 type: String,
 default: 'id'
 },
 filterForm: {
 type: Object,
 default: () => ({})
 },
 filterType: {
 type: Object,
 default: () => ({})
 },
 filterOptions: {
 type: Object,
 default: () => ({})
 },
 filterLabels: {
 type: Object,
 default: () => ({})
 },
 treeProps: {
 type: Object,
 default: () => ({ children: 'children', hasChildren: 'hasChildren' })
 },
 defaultExpandAll: {
 type: Boolean,
 default: false
 },
 defaultSort: {
 type: Object,
 default: () => ({})
 }
});
const emit = defineEmits([
 'size-change',
 'current-change',
 'selection-change',
 'sort-change',
 'filter-change',
 'add',
 'edit',
 'delete',
 'batch-delete',
 'edit-save',
 'edit-cancel',
 'column-update'
]);
const selectedRows = ref([]);
const showColumnConfig = ref(false);
const editableRows = ref([]);
const editBackup = ref({});
const visibleColumns = computed(() => {
 return props.columns.filter(col => col.visible !== false);
});
const getFilterLabel = (key) => {
 return props.filterLabels[key] || key;
};
const handleSelectionChange = (val) => {
 selectedRows.value = val;
 emit('selection-change', val);
};
const handleSortChange = ({ prop, order }) => {
 emit('sort-change', { prop, order });
};
const handleSizeChange = (val) => {
 emit('size-change', val);
};
const handleCurrentChange = (val) => {
 emit('current-change', val);
};
const handleFilter = () => {
 emit('filter-change', { ...props.filterForm });
};
const handleResetFilter = () => {
 Object.keys(props.filterForm).forEach(key => {
 props.filterForm[key] = '';
 });
 emit('filter-change', {});
};
const handleAdd = () => {
 emit('add');
};
const handleEdit = (row) => {
 editableRows.value.push(row[props.rowKey]);
 editBackup.value[row[props.rowKey]] = { ...row };
 emit('edit', row);
};
const handleEditBlur = (row, prop) => {
};
const handleSaveEdit = (row) => {
 const index = editableRows.value.indexOf(row[props.rowKey]);
 if (index > -1) {
 editableRows.value.splice(index, 1);
 }
 emit('edit-save', row);
};
const handleCancelEdit = (row) => {
 const backup = editBackup.value[row[props.rowKey]];
 if (backup) {
 Object.keys(backup).forEach(key => {
 row[key] = backup[key];
 });
 delete editBackup.value[row[props.rowKey]];
 }
 const index = editableRows.value.indexOf(row[props.rowKey]);
 if (index > -1) {
 editableRows.value.splice(index, 1);
 }
 emit('edit-cancel', row);
};
const handleDelete = (row) => {
 ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
 confirmButtonText: '确定',
 cancelButtonText: '取消',
 type: 'warning'
 }).then(() => {
 emit('delete', row);
 ElMessage.success('删除成功');
 }).catch(() => {
 ElMessage.info('已取消删除');
 });
};
const handleBatchDelete = () => {
 ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条记录吗？`, '提示', {
 confirmButtonText: '确定',
 cancelButtonText: '取消',
 type: 'warning'
 }).then(() => {
 emit('batch-delete', selectedRows.value);
 selectedRows.value = [];
 ElMessage.success('批量删除成功');
 }).catch(() => {
 ElMessage.info('已取消删除');
 });
};
const handleExport = () => {
 const exportData = props.tableData.map(row => {
 const item = {};
 props.columns.filter(col => col.visible !== false && !col.hidden).forEach(col => {
 item[col.label || col.prop] = col.formatter ? col.formatter(row) : row[col.prop];
 });
 return item;
 });
 exportToExcel(exportData, 'table_data');
};
const handleColumnUpdate = (newColumns) => {
 emit('column-update', newColumns);
};
watch(() => props.currentPage, () => {
 selectedRows.value = [];
});
</script>

<style lang="scss" scoped>
.advanced-table {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;

  .toolbar-left,
  .toolbar-right {
    display: flex;
    gap: 8px;
  }
}

.table-filter {
  padding: 12px 20px;
  background-color: #fafafa;
  border-bottom: 1px solid #eee;
}

.table-container {
  flex: 1;
  overflow: auto;
}

.main-table {
  width: 100%;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #eee;
}
</style>