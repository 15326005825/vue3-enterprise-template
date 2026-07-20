<template>
  <div class="chart-demo">
    <el-card>
      <h2>图表组件演示</h2>
      
      <div class="demo-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="折线图" name="line">
            <div class="chart-section">
              <div class="chart-controls">
                <el-switch v-model="lineSmooth" active-text="平滑" inactive-text="折线" />
                <el-switch v-model="lineShowArea" active-text="显示面积" inactive-text="隐藏面积" />
                <el-switch v-model="lineDataZoom" active-text="显示缩放" inactive-text="隐藏缩放" />
              </div>
              <LineChart
                :title="'月度销售趋势'"
                :subtitle="'2024年数据'"
                :xAxisData="lineXData"
                :data="lineChartData"
                :smooth="lineSmooth"
                :showArea="lineShowArea"
                :dataZoom="lineDataZoom"
                :height="'400px'"
                @click="handleChartClick"
              />
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="柱状图" name="bar">
            <div class="chart-section">
              <div class="chart-controls">
                <el-switch v-model="barHorizontal" active-text="横向" inactive-text="纵向" />
                <el-switch v-model="barShowLabel" active-text="显示标签" inactive-text="隐藏标签" />
              </div>
              <BarChart
                :title="'部门业绩对比'"
                :subtitle="'2024年Q2'"
                :xAxisData="barXData"
                :data="barChartData"
                :horizontal="barHorizontal"
                :showLabel="barShowLabel"
                :height="'400px'"
                @click="handleChartClick"
              />
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="饼图" name="pie">
            <div class="chart-section">
              <div class="chart-controls">
                <el-switch v-model="pieDoughnut" active-text="环形" inactive-text="普通" />
                <el-select v-model="pieRoseType" placeholder="玫瑰图类型">
                  <el-option label="无" value="" />
                  <el-option label="面积" value="area" />
                  <el-option label="半径" value="radius" />
                </el-select>
              </div>
              <PieChart
                :title="'市场份额占比'"
                :data="pieChartData"
                :doughnut="pieDoughnut"
                :roseType="pieRoseType"
                :height="'400px'"
                @click="handleChartClick"
              />
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="地图" name="map">
            <div class="chart-section">
              <div class="chart-controls">
                <el-switch v-model="mapDrillDown" active-text="开启下钻" inactive-text="关闭下钻" />
                <el-button @click="resetMap" type="primary" size="small">返回全国</el-button>
              </div>
              <MapChart
                ref="mapChartRef"
                :title="'全国销售分布'"
                :data="mapChartData"
                :drillDown="mapDrillDown"
                :height="'500px'"
                :visualMapMin="0"
                :visualMapMax="2500"
                @click="handleMapClick"
                @drilldown="handleDrillDown"
              />
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="图表联动" name="group">
            <div class="chart-section">
              <div class="chart-controls">
                <el-switch v-model="syncHighlight" active-text="高亮联动" inactive-text="关闭" />
                <el-switch v-model="syncTooltip" active-text="Tooltip联动" inactive-text="关闭" />
              </div>
              <ChartGroup :syncHighlight="syncHighlight" :syncTooltip="syncTooltip">
                <div class="chart-grid">
                  <div class="chart-item">
                    <BarChart
                      :title="'销售额'"
                      :xAxisData="groupXData"
                      :data="groupBarData"
                      :height="'300px'"
                      :groupName="'salesGroup'"
                    />
                  </div>
                  <div class="chart-item">
                    <LineChart
                      :title="'订单量'"
                      :xAxisData="groupXData"
                      :data="groupLineData"
                      :height="'300px'"
                      :groupName="'salesGroup'"
                    />
                  </div>
                  <div class="chart-item" style="grid-column: span 2;">
                    <PieChart
                      :title="'销售占比'"
                      :data="groupPieData"
                      :height="'300px'"
                      :groupName="'salesGroup'"
                    />
                  </div>
                </div>
              </ChartGroup>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="主题切换" name="theme">
            <div class="chart-section">
              <div class="chart-controls">
                <el-button @click="theme = 'light'" :type="theme === 'light' ? 'primary' : ''">亮色主题</el-button>
                <el-button @click="theme = 'dark'" :type="theme === 'dark' ? 'primary' : ''">暗色主题</el-button>
              </div>
              <div :class="['theme-container', theme]">
                <div class="theme-charts">
                  <LineChart
                    :title="'收入趋势'"
                    :xAxisData="themeXData"
                    :data="themeLineData"
                    :theme="theme"
                    :height="'350px'"
                  />
                  <PieChart
                    :title="'收入分布'"
                    :data="themePieData"
                    :theme="theme"
                    :height="'350px'"
                  />
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <div class="chart-result" v-if="chartResult">
        <h3>点击数据:</h3>
        <pre>{{ JSON.stringify(chartResult, null, 2) }}</pre>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LineChart from '@components/Chart/LineChart.vue'
import BarChart from '@components/Chart/BarChart.vue'
import PieChart from '@components/Chart/PieChart.vue'
import MapChart from '@components/Chart/MapChart.vue'
import ChartGroup from '@components/Chart/ChartGroup.vue'

const activeTab = ref('line')
const chartResult = ref(null)
const mapChartRef = ref(null)

const lineSmooth = ref(false)
const lineShowArea = ref(false)
const lineDataZoom = ref(false)
const lineXData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const lineChartData = [
  { name: '产品A', data: [120, 132, 101, 134, 190, 230, 220, 182, 191, 234, 290, 330] },
  { name: '产品B', data: [82, 93, 90, 94, 105, 110, 120, 132, 130, 120, 130, 140] },
  { name: '产品C', data: [62, 73, 80, 74, 85, 90, 80, 92, 80, 90, 85, 95] }
]

const barHorizontal = ref(false)
const barShowLabel = ref(false)
const barXData = ['技术部', '产品部', '运营部', '销售部', '市场部']
const barChartData = [
  { name: 'Q1', data: [320, 280, 240, 380, 260] },
  { name: 'Q2', data: [340, 300, 280, 420, 300] },
  { name: 'Q3', data: [380, 320, 300, 450, 320] }
]

const pieDoughnut = ref(false)
const pieRoseType = ref('')
const pieChartData = [
  { name: '华东', value: 3350 },
  { name: '华南', value: 2780 },
  { name: '华北', value: 1950 },
  { name: '西南', value: 1480 },
  { name: '西北', value: 980 },
  { name: '其他', value: 520 }
]

const mapDrillDown = ref(true)
const mapChartData = [
  { name: '北京市', value: 1200 },
  { name: '天津市', value: 580 },
  { name: '河北省', value: 890 },
  { name: '山西省', value: 450 },
  { name: '内蒙古自治区', value: 320 },
  { name: '辽宁省', value: 680 },
  { name: '吉林省', value: 420 },
  { name: '黑龙江省', value: 510 },
  { name: '上海市', value: 1500 },
  { name: '江苏省', value: 1800 },
  { name: '浙江省', value: 1650 },
  { name: '安徽省', value: 780 },
  { name: '福建省', value: 920 },
  { name: '江西省', value: 560 },
  { name: '山东省', value: 1400 },
  { name: '河南省', value: 980 },
  { name: '湖北省', value: 1100 },
  { name: '湖南省', value: 850 },
  { name: '广东省', value: 2200 },
  { name: '广西壮族自治区', value: 620 },
  { name: '海南省', value: 280 },
  { name: '重庆市', value: 750 },
  { name: '四川省', value: 1050 },
  { name: '贵州省', value: 420 },
  { name: '云南省', value: 580 },
  { name: '西藏自治区', value: 80 },
  { name: '陕西省', value: 680 },
  { name: '甘肃省', value: 320 },
  { name: '青海省', value: 120 },
  { name: '宁夏回族自治区', value: 180 },
  { name: '新疆维吾尔自治区', value: 350 }
]

const syncHighlight = ref(true)
const syncTooltip = ref(false)
const groupXData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const groupBarData = [
  { name: '销售额', data: [1200, 1320, 1010, 1340, 1900, 2300, 2200] }
]
const groupLineData = [
  { name: '订单量', data: [80, 92, 71, 84, 120, 150, 140] }
]
const groupPieData = [
  { name: '线上', value: 4500 },
  { name: '线下', value: 3200 },
  { name: '分销', value: 1800 },
  { name: '其他', value: 500 }
]

const theme = ref('light')
const themeXData = ['1月', '2月', '3月', '4月', '5月', '6月']
const themeLineData = [
  { name: '收入', data: [1200, 1320, 1010, 1340, 1900, 2300] },
  { name: '支出', data: [800, 920, 710, 840, 1200, 1500] }
]
const themePieData = [
  { name: '产品收入', value: 4500 },
  { name: '服务收入', value: 2800 },
  { name: '其他收入', value: 1200 }
]

const handleChartClick = (params) => {
  chartResult.value = {
    type: params.seriesType,
    name: params.name,
    value: params.value,
    seriesName: params.seriesName,
    dataIndex: params.dataIndex
  }
}

const handleMapClick = (params) => {
  chartResult.value = {
    type: 'map',
    name: params.name,
    value: params.value,
    area: params.name
  }
}

const handleDrillDown = (params) => {
  chartResult.value = {
    type: 'drilldown',
    name: params.name,
    code: params.code
  }
}

const resetMap = () => {
  mapChartRef.value?.resetMap()
}
</script>

<style lang="scss" scoped>
.chart-demo {
  padding: 20px;
  
  .demo-tabs {
    margin-top: 20px;
  }
  
  .chart-section {
    margin-top: 20px;
  }
  
  .chart-controls {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    align-items: center;
  }
  
  .chart-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .chart-item {
    background-color: #f9fafc;
    border-radius: 8px;
    padding: 16px;
  }
  
  .theme-container {
    border-radius: 8px;
    padding: 20px;
    
    &.light {
      background-color: #f9fafc;
    }
    
    &.dark {
      background-color: #1a1a2e;
    }
  }
  
  .theme-charts {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .chart-result {
    margin-top: 20px;
    padding: 20px;
    background-color: #f9fafc;
    border-radius: 8px;
    
    pre {
      background-color: #fff;
      padding: 16px;
      border-radius: 4px;
      overflow-x: auto;
    }
  }
}
</style>