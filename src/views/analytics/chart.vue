<template>
  <div class="analytics-chart">
    <el-card>
      <template #header>
        <span>可视化图表</span>
      </template>
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-title">用户分布</div>
          <PieChart
            :title="'用户分布'"
            :data="pieData"
            :radius="'50%'"
            :height="'200px'"
          />
        </div>
        <div class="chart-card">
          <div class="chart-title">月度对比</div>
          <BarChart
            :title="'月度对比'"
            :xAxisData="barXData"
            :data="barData"
            :height="'200px'"
          />
        </div>
        <div class="chart-card">
          <div class="chart-title">增长趋势</div>
          <LineChart
            :title="'增长趋势'"
            :xAxisData="lineXData"
            :data="lineData"
            :smooth="true"
            :height="'200px'"
          />
        </div>
        <div class="chart-card">
          <div class="chart-title">地域分布</div>
          <MapChart
            :title="'地域分布'"
            :data="mapData"
            :height="'200px'"
            :visualMapMin="0"
            :visualMapMax="1500"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PieChart from '@components/Chart/PieChart.vue'
import BarChart from '@components/Chart/BarChart.vue'
import LineChart from '@components/Chart/LineChart.vue'
import MapChart from '@components/Chart/MapChart.vue'

const pieData = ref([
  { name: '华东', value: 3350 },
  { name: '华北', value: 2780 },
  { name: '华南', value: 2510 },
  { name: '西南', value: 1890 },
  { name: '其他', value: 1270 }
])

const barXData = ref(['1月', '2月', '3月', '4月', '5月', '6月'])
const barData = ref([
  { name: '订单量', data: [1200, 1320, 1010, 1340, 1900, 2300] },
  { name: '销售额', data: [980, 1100, 850, 1200, 1600, 2100] }
])

const lineXData = ref(['1月', '2月', '3月', '4月', '5月', '6月'])
const lineData = ref([
  { name: '新用户', data: [820, 932, 901, 934, 1290, 1330] },
  { name: '活跃用户', data: [620, 732, 701, 734, 990, 1130] }
])

const mapData = ref([
  { name: '北京市', value: 1200 },
  { name: '上海市', value: 1500 },
  { name: '广东省', value: 1800 },
  { name: '江苏省', value: 1100 },
  { name: '浙江省', value: 980 },
  { name: '山东省', value: 850 },
  { name: '四川省', value: 720 },
  { name: '湖北省', value: 680 }
])
</script>

<style scoped>
.analytics-chart {
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .chart-card {
    background: #fafafa;
    padding: 20px;
    border-radius: 8px;
    height: 280px;
    display: flex;
    flex-direction: column;
    
    .chart-title {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 14px;
      color: #303133;
    }
  }
}
</style>