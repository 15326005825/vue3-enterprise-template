<template>
  <div class="dashboard">
    <div class="stats-card">
      <div class="stat-item">
        <div class="stat-icon blue">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">1,234</div>
          <div class="stat-label">用户总数</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon green">
          <el-icon><Document /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">5,678</div>
          <div class="stat-label">订单数量</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon orange">
          <el-icon><PieChart /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">¥123,456</div>
          <div class="stat-label">销售额</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon purple">
          <el-icon><Setting /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">99%</div>
          <div class="stat-label">系统可用性</div>
        </div>
      </div>
    </div>
    
    <div class="chart-card">
      <el-card header="地域分布">
        <div class="map-tip">
          <el-icon><InfoFilled /></el-icon>
          <span>点击省份可下钻查看市级数据，右键点击可返回上级地图</span>
        </div>
        <MapChart
          :title="''"
          :data="mapData"
          :height="'60vh'"
          :visualMapMin="0"
          :visualMapMax="2500"
          :showLabel="true"
          :labelColor="'#333'"
          :drillDown="true"
          :showScale="true"
          @drilldown="handleDrilldown"
          @drillup="handleDrillup"
          @click="handleMapClick"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, Document, PieChart, Setting, InfoFilled } from '@element-plus/icons-vue'
import MapChart from '@components/Chart/MapChart.vue'

const handleDrilldown = (params) => {
  console.log('地图下钻:', params)
}

const handleMapClick = (params) => {
  console.log('地图点击:', params)
}

const handleDrillup = (params) => {
  console.log('地图返回上级:', params)
}

const mapData = ref([
  { name: '北京市', value: 1200 },
  { name: '上海市', value: 1500 },
  { name: '广东省', value: 2200 },
  { name: '江苏省', value: 1300 },
  { name: '浙江省', value: 1100 },
  { name: '山东省', value: 980 },
  { name: '四川省', value: 850 },
  { name: '湖北省', value: 720 },
  { name: '湖南省', value: 680 },
  { name: '福建省', value: 650 },
  { name: '河南省', value: 920 },
  { name: '河北省', value: 780 },
  { name: '安徽省', value: 750 },
  { name: '辽宁省', value: 620 },
  { name: '重庆市', value: 580 },
  { name: '天津市', value: 450 },
  { name: '云南省', value: 420 },
  { name: '陕西省', value: 510 },
  { name: '黑龙江省', value: 380 },
  { name: '广西壮族自治区', value: 560 }
])
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 0;
}

.stats-card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  
  &.blue {
    background-color: #ecf5ff;
    color: #409eff;
  }
  
  &.green {
    background-color: #f0f9eb;
    color: #67c23a;
  }
  
  &.orange {
    background-color: #fef7ec;
    color: #e6a23c;
  }
  
  &.purple {
    background-color: #f5f0ff;
    color: #9b59b6;
  }
}

.stat-info {
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
  }
  
  .stat-label {
    font-size: 14px;
    color: #909399;
  }
}

.chart-card {
  background-color: #fff;
  border-radius: 8px;
}

.map-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #ecf5ff;
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #409eff;
  
  .el-icon {
    font-size: 14px;
  }
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  
  p {
    margin-top: 16px;
  }
}
</style>