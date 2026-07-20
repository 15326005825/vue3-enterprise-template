<template>
  <div class="user-list">
    <el-card>
      <div class="card-header">
        <h2>用户列表</h2>
        <el-button type="primary" v-permission="'user:add'" @click="handleAdd">添加用户</el-button>
      </div>

      <AdvancedTable
        :table-data="tableData"
        :loading="loading"
        :columns="columns"
        :total="total"
        :current-page="page"
        :page-size="pageSize"
        :show-selection="true"
        :show-actions="true"
        :show-pagination="true"
        :show-toolbar="true"
        :show-add-btn="false"
        :show-batch-delete-btn="true"
        :show-export-btn="true"
        :show-column-config-btn="true"
        :filter-form="filterForm"
        :filter-type="filterType"
        :filter-options="filterOptions"
        :filter-labels="filterLabels"
        border
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        @filter-change="handleFilterChange"
        @delete="handleDelete"
        @batch-delete="handleBatchDelete"
        @edit-save="handleEditSave"
        @column-update="handleColumnUpdate"
      >
        <template #custom-status="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
            {{ row.status === 'active' ? '正常' : '禁用' }}
          </el-tag>
        </template>
        <template #custom-role="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : row.role === 'user' ? 'primary' : 'info'">
            {{ row.role === 'admin' ? '管理员' : row.role === 'user' ? '普通用户' : '访客' }}
          </el-tag>
        </template>
        <template #actions="{ row }">
          <el-button size="small" v-permission="'user:edit'" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" v-permission="'user:delete'" @click="handleDelete(row)">删除</el-button>
        </template>
      </AdvancedTable>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import AdvancedTable from '@components/Table/index.vue'

const router = useRouter()

const tableData = ref([
  { id: 1, username: 'admin', name: '管理员', email: 'admin@example.com', role: 'admin', department: '技术部', status: 'active' },
  { id: 2, username: 'zhangsan', name: '张三', email: 'zhangsan@example.com', role: 'user', department: '产品部', status: 'active' },
  { id: 3, username: 'lisi', name: '李四', email: 'lisi@example.com', role: 'user', department: '运营部', status: 'active' },
  { id: 4, username: 'wangwu', name: '王五', email: 'wangwu@example.com', role: 'guest', department: '市场部', status: 'disabled' },
  { id: 5, username: 'zhaoliu', name: '赵六', email: 'zhaoliu@example.com', role: 'user', department: '销售部', status: 'active' },
  { id: 6, username: 'sunqi', name: '孙七', email: 'sunqi@example.com', role: 'user', department: '财务部', status: 'active' },
  { id: 7, username: 'zhouba', name: '周八', email: 'zhouba@example.com', role: 'guest', department: '人力资源部', status: 'disabled' },
  { id: 8, username: 'wujiu', name: '吴九', email: 'wujiu@example.com', role: 'admin', department: '技术部', status: 'active' }
])

const loading = ref(false)
const total = ref(tableData.value.length)
const page = ref(1)
const pageSize = ref(10)

const filterForm = ref({
  name: '',
  role: '',
  status: ''
})

const filterType = {
  name: 'input',
  role: 'select',
  status: 'select'
}

const filterOptions = {
  role: [
    { label: '管理员', value: 'admin' },
    { label: '普通用户', value: 'user' },
    { label: '访客', value: 'guest' }
  ],
  status: [
    { label: '正常', value: 'active' },
    { label: '禁用', value: 'disabled' }
  ]
}

const filterLabels = {
  name: '用户名',
  role: '角色',
  status: '状态'
}

const columns = ref([
  { prop: 'id', label: 'ID', width: '80', fixed: 'left' },
  { prop: 'username', label: '登录名', width: '120', sortable: true },
  { prop: 'name', label: '用户名', width: '120', sortable: true, editable: true, editType: 'input' },
  { prop: 'email', label: '邮箱', width: '200', sortable: true },
  { prop: 'role', label: '角色', width: '100' },
  { prop: 'department', label: '部门', width: '120', editable: true, editType: 'input' },
  { prop: 'status', label: '状态', width: '100' }
])

const handleSizeChange = (val) => {
  pageSize.value = val
  page.value = 1
}

const handleCurrentChange = (val) => {
  page.value = val
}

const handleSelectionChange = (val) => {
  console.log('选中:', val)
}

const handleSortChange = ({ prop, order }) => {
  console.log('排序:', prop, order)
}

const handleFilterChange = (filters) => {
  console.log('筛选:', filters)
}

const handleAdd = () => {
  router.push('/user/add')
}

const handleEdit = (row) => {
  router.push(`/user/edit/${row.id}`)
}

const handleEditSave = (row) => {
  ElMessage.success(`保存用户: ${row.name}`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      total.value = tableData.value.length
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleBatchDelete = (rows) => {
  ElMessageBox.confirm(`确定要删除选中的 ${rows.length} 条记录吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = rows.map(row => row.id)
    tableData.value = tableData.value.filter(item => !ids.includes(item.id))
    total.value = tableData.value.length
    ElMessage.success(`批量删除成功，共删除 ${rows.length} 条记录`)
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleColumnUpdate = (newColumns) => {
  columns.value = newColumns
}

onMounted(() => {
})
</script>

<style lang="scss" scoped>
.user-list {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 20px;
      color: #303133;
    }
  }
}
</style>