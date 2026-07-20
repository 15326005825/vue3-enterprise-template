<template>
  <div class="order-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单列表</span>
          <el-button type="primary" v-permission="'order:add'">添加订单</el-button>
        </div>
      </template>
      <el-table :data="orderList" border>
        <el-table-column prop="id" label="订单ID" width="120" />
        <el-table-column prop="customer" label="客户名称" width="150" />
        <el-table-column prop="amount" label="订单金额" width="120" />
        <el-table-column prop="status" label="订单状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'paid' ? 'success' : 'warning'">
              {{ scope.row.status === 'paid' ? '已支付' : '待支付' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row)">查看</el-button>
            <el-button size="small" type="primary" v-permission="'order:edit'">编辑</el-button>
            <el-button size="small" type="danger" v-permission="'order:delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        class="pagination"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const orderList = ref([
  { id: 'ORD001', customer: '张三', amount: 1280.00, status: 'paid', createTime: '2024-01-15 10:30:00' },
  { id: 'ORD002', customer: '李四', amount: 2560.00, status: 'pending', createTime: '2024-01-15 11:45:00' },
  { id: 'ORD003', customer: '王五', amount: 890.00, status: 'paid', createTime: '2024-01-14 14:20:00' },
  { id: 'ORD004', customer: '赵六', amount: 3420.00, status: 'pending', createTime: '2024-01-14 16:00:00' },
  { id: 'ORD005', customer: '钱七', amount: 1560.00, status: 'paid', createTime: '2024-01-13 09:15:00' }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const viewDetail = (row) => {
  console.log('查看订单详情:', row)
}
</script>

<style scoped>
.order-list {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>