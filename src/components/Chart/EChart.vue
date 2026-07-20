<template>
  <div 
    ref="chartRef" 
    :class="['echart-container', { 'dark-theme': theme === 'dark' }]"
    :style="containerStyle"
  ></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick, inject } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: '400px'
  },
  option: {
    type: Object,
    default: () => ({})
  },
  theme: {
    type: String,
    default: 'light',
    validator: (value) => ['light', 'dark'].includes(value)
  },
  autoResize: {
    type: Boolean,
    default: true
  },
  refreshInterval: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: '加载中...'
  },
  groupName: {
    type: String,
    default: ''
  },
  animation: {
    type: Boolean,
    default: true
  },
  animationDuration: {
    type: Number,
    default: 1000
  }
})

const emit = defineEmits(['ready', 'click', 'dblclick', 'mouseover', 'mouseout', 'contextmenu', 'dataZoom', 'legendselectchanged', 'refresh'])

const chartRef = ref(null)
let chartInstance = null
let resizeObserver = null
let refreshTimer = null
let sizeCheckTimer = null

const chartGroup = inject('chartGroup', null)

const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}))

const getThemeOption = (baseOption) => {
  const themeColors = props.theme === 'dark' ? {
    backgroundColor: 'transparent',
    textColor: '#e0e0e0',
    titleColor: '#fff',
    axisLineColor: '#555',
    splitLineColor: '#333',
    tooltipBgColor: 'rgba(0, 0, 0, 0.8)'
  } : {
    backgroundColor: 'transparent',
    textColor: '#333',
    titleColor: '#303133',
    axisLineColor: '#dcdfe6',
    splitLineColor: '#ebeef5',
    tooltipBgColor: 'rgba(255, 255, 255, 0.95)'
  }

  return {
    ...baseOption,
    backgroundColor: themeColors.backgroundColor,
    textStyle: {
      ...baseOption.textStyle,
      color: themeColors.textColor
    },
    title: baseOption.title ? {
      ...baseOption.title,
      textStyle: {
        ...baseOption.title.textStyle,
        color: themeColors.titleColor
      }
    } : undefined,
    tooltip: baseOption.tooltip ? {
      ...baseOption.tooltip,
      backgroundColor: themeColors.tooltipBgColor
    } : undefined,
    xAxis: baseOption.xAxis ? {
      ...baseOption.xAxis,
      axisLine: {
        ...baseOption.xAxis.axisLine,
        lineStyle: {
          ...baseOption.xAxis.axisLine?.lineStyle,
          color: themeColors.axisLineColor
        }
      },
      splitLine: {
        ...baseOption.xAxis.splitLine,
        lineStyle: {
          ...baseOption.xAxis.splitLine?.lineStyle,
          color: themeColors.splitLineColor
        }
      },
      axisLabel: {
        ...baseOption.xAxis.axisLabel,
        color: themeColors.textColor
      }
    } : undefined,
    yAxis: baseOption.yAxis ? {
      ...baseOption.yAxis,
      axisLine: {
        ...baseOption.yAxis.axisLine,
        lineStyle: {
          ...baseOption.yAxis.axisLine?.lineStyle,
          color: themeColors.axisLineColor
        }
      },
      splitLine: {
        ...baseOption.yAxis.splitLine,
        lineStyle: {
          ...baseOption.yAxis.splitLine?.lineStyle,
          color: themeColors.splitLineColor
        }
      },
      axisLabel: {
        ...baseOption.yAxis.axisLabel,
        color: themeColors.textColor
      }
    } : undefined
  }
}

const initChart = async () => {
  if (!chartRef.value) return

  await nextTick()

  const rect = chartRef.value.getBoundingClientRect()
  console.log('EChart initChart rect:', rect)
  if (rect.width === 0 || rect.height === 0) {
    sizeCheckTimer = setInterval(() => {
      const newRect = chartRef.value?.getBoundingClientRect()
      if (newRect && newRect.width > 0 && newRect.height > 0) {
        clearInterval(sizeCheckTimer)
        sizeCheckTimer = null
        console.log('EChart size check passed:', newRect)
        performInit()
      }
    }, 100)
    return
  }

  performInit()
}

const performInit = () => {
  if (!chartRef.value) {
    console.log('EChart init failed: chartRef is null')
    return
  }

  const rect = chartRef.value.getBoundingClientRect()
  console.log('EChart init: container rect:', rect)

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value, props.theme === 'dark' ? 'dark' : undefined)

  if (props.groupName) {
    chartInstance.group = props.groupName
  }

  bindEvents()

  updateOption()

  if (props.autoResize) {
    setupResizeObserver()
  }

  if (props.refreshInterval > 0) {
    startRefreshTimer()
  }

  if (chartGroup && chartInstance) {
    chartGroup.registerChart(chartInstance)
  }

  emit('ready', chartInstance)
}

const handleClick = (params) => {
  console.log('EChart click event:', params)
  emit('click', params)
}

const handleDblclick = (params) => {
  emit('dblclick', params)
}

const handleMouseover = (params) => {
  emit('mouseover', params)
}

const handleMouseout = (params) => {
  emit('mouseout', params)
}

const handleDataZoom = (params) => {
  emit('dataZoom', params)
}

const handleLegendSelectChanged = (params) => {
  emit('legendselectchanged', params)
}

const handleContextmenu = (params) => {
  emit('contextmenu', params)
}

const bindEvents = () => {
  if (!chartInstance) return

  chartInstance.off('click', handleClick)
  chartInstance.off('dblclick', handleDblclick)
  chartInstance.off('mouseover', handleMouseover)
  chartInstance.off('mouseout', handleMouseout)
  chartInstance.off('contextmenu', handleContextmenu)
  chartInstance.off('dataZoom', handleDataZoom)
  chartInstance.off('legendselectchanged', handleLegendSelectChanged)

  chartInstance.on('click', handleClick)
  chartInstance.on('dblclick', handleDblclick)
  chartInstance.on('mouseover', handleMouseover)
  chartInstance.on('mouseout', handleMouseout)
  chartInstance.on('contextmenu', handleContextmenu)
  chartInstance.on('dataZoom', handleDataZoom)
  chartInstance.on('legendselectchanged', handleLegendSelectChanged)
}

const setupResizeObserver = () => {
  resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize()
  })

  if (chartRef.value) {
    resizeObserver.observe(chartRef.value)
  }
}

const startRefreshTimer = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }

  refreshTimer = setInterval(() => {
    emit('refresh')
  }, props.refreshInterval * 1000)
}

const updateOption = () => {
  if (!chartInstance) return

  const option = {
    ...getThemeOption(props.option),
    animation: props.animation,
    animationDuration: props.animationDuration
  }

  chartInstance.setOption(option, true)
}

const toggleLoading = (loading = props.loading) => {
  if (!chartInstance) return

  if (loading) {
    chartInstance.showLoading({
      text: props.loadingText,
      color: '#409eff',
      textColor: '#333',
      maskColor: 'rgba(255, 255, 255, 0.8)',
      zlevel: 0
    })
  } else {
    chartInstance.hideLoading()
  }
}

const resize = () => {
  chartInstance?.resize()
}

const dispose = () => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }

  if (sizeCheckTimer) {
    clearInterval(sizeCheckTimer)
    sizeCheckTimer = null
  }

  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

watch(() => props.option, (newOption) => {
  console.log('EChart option updated:', newOption?.series?.[0]?.map)
  updateOption()
}, { deep: true })

watch(() => props.theme, () => {
  initChart()
})

watch(() => props.loading, (newVal) => {
  toggleLoading(newVal)
})

watch(() => props.groupName, (newVal) => {
  if (chartInstance) {
    chartInstance.group = newVal || ''
  }
})

watch(() => props.refreshInterval, (newVal) => {
  if (newVal > 0) {
    startRefreshTimer()
  } else {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }
})

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  dispose()
})

defineExpose({
  getChartInstance: () => chartInstance,
  resize,
  dispose,
  toggleLoading,
  updateOption,
  getOption: () => chartInstance?.getOption(),
  setOption: (option, notMerge) => chartInstance?.setOption(option, notMerge)
})
</script>

<style lang="scss" scoped>
.echart-container {
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.dark-theme {
  background-color: #1a1a2e;
}
</style>