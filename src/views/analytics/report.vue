<template>
  <div class="analytics-report">
    <el-card>
      <template #header>
        <span>数据报表</span>
      </template>
      <div class="report-stats">
        <div class="stat-item">
          <div class="stat-value">¥123,456</div>
          <div class="stat-label">本月销售额</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">5,678</div>
          <div class="stat-label">订单数量</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">89%</div>
          <div class="stat-label">转化率</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">1,234</div>
          <div class="stat-label">新增用户</div>
        </div>
      </div>
      <el-divider content-position="left">销售趋势</el-divider>
      <div class="chart-container">
        <div class="chart-placeholder">图表区域</div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.analytics-report {
  .report-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .stat-item {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    border-radius: 8px;
    color: #fff;
    
    .stat-value {
      font-size: 28px;
      font-weight: bold;
    }
    
    .stat-label {
      font-size: 14px;
      opacity: 0.8;
      margin-top: 5px;
    }
  }
  
  .chart-container {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .chart-placeholder {
    color: #999;
    font-size: 18px;
  }
}
</style>