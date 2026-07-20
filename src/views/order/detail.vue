<template>
  <div class="order-detail">
    <el-card>
      <template #header>
        <span>订单详情</span>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单ID">ORD001</el-descriptions-item>
        <el-descriptions-item label="客户名称">张三</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥1,280.00</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag type="success">已支付</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">2024-01-15 10:30:00</el-descriptions-item>
        <el-descriptions-item label="支付时间">2024-01-15 10:35:00</el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left">商品列表</el-divider>
      <el-table :data="products" border>
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="price" label="单价" width="100" />
        <el-table-column prop="total" label="小计" width="100" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const products = ref([
  { name: '商品A', quantity: 2, price: 399.00, total: 798.00 },
  { name: '商品B', quantity: 1, price: 482.00, total: 482.00 }
])
</script>

<style scoped>
.order-detail {
}
</style>