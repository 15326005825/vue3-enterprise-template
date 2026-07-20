<template>
  <div class="custom-chart">
    <div ref="chartRef" :style="{ height: height, width: width }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'bar'
  },
  data: {
    type: Array,
    default: () => []
  },
  height: {
    type: String,
    default: '300px'
  },
  width: {
    type: String,
    default: '100%'
  },
  option: {
    type: Object,
    default: () => ({})
  }
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartRef.value) return
  
  const canvas = document.createElement('canvas')
  chartRef.value.innerHTML = ''
  chartRef.value.appendChild(canvas)
  
  const ctx = canvas.getContext('2d')
  canvas.width = chartRef.value.offsetWidth
  canvas.height = parseInt(props.height)
  
  drawChart(ctx, canvas.width, canvas.height)
}

const drawChart = (ctx, width, height) => {
  if (props.data.length === 0) {
    ctx.fillStyle = '#909399'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('暂无数据', width / 2, height / 2)
    return
  }
  
  const padding = { top: 40, right: 40, bottom: 40, left: 50 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  
  ctx.strokeStyle = '#ebeef5'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight / 5) * i
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(width - padding.right, y)
    ctx.stroke()
  }
  
  const maxValue = Math.max(...props.data.map(item => item.value))
  const barWidth = (chartWidth / props.data.length) * 0.6
  const gap = (chartWidth / props.data.length) * 0.4
  
  props.data.forEach((item, index) => {
    const x = padding.left + (chartWidth / props.data.length) * index + gap / 2
    const barHeight = (item.value / maxValue) * chartHeight
    const y = padding.top + chartHeight - barHeight
    
    const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartHeight)
    gradient.addColorStop(0, '#409eff')
    gradient.addColorStop(1, '#79bbff')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.roundRect(x, y, barWidth, barHeight, 4)
    ctx.fill()
    
    ctx.fillStyle = '#606266'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(item.label, x + barWidth / 2, height - 10)
  })
}

onMounted(() => {
  initChart()
})

watch(() => props.data, () => {
  initChart()
}, { deep: true })

defineExpose({
  chartRef,
  refresh: initChart
})
</script>

<style lang="scss" scoped>
.custom-chart {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
}
</style>