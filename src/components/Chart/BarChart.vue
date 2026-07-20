<template>
  <EChart
    :width="width"
    :height="height"
    :option="chartOption"
    :theme="theme"
    :autoResize="autoResize"
    :refreshInterval="refreshInterval"
    :loading="loading"
    :loadingText="loadingText"
    :groupName="groupName"
    :animation="animation"
    :animationDuration="animationDuration"
    @ready="handleReady"
    @click="handleClick"
    @dblclick="handleDblclick"
    @mouseover="handleMouseover"
    @mouseout="handleMouseout"
    @dataZoom="handleDataZoom"
    @legendselectchanged="handleLegendSelectChanged"
    @refresh="handleRefresh"
    ref="chartRef"
  />
</template>

<script setup>
import { computed, ref } from 'vue'
import EChart from './EChart.vue'

const props = defineProps({
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: '400px'
  },
  data: {
    type: Array,
    default: () => []
  },
  xAxisData: {
    type: Array,
    default: () => []
  },
  series: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  xAxisName: {
    type: String,
    default: ''
  },
  yAxisName: {
    type: String,
    default: ''
  },
  stack: {
    type: String,
    default: ''
  },
  barWidth: {
    type: [String, Number],
    default: 'auto'
  },
  barGap: {
    type: String,
    default: '10%'
  },
  barCategoryGap: {
    type: String,
    default: '20%'
  },
  horizontal: {
    type: Boolean,
    default: false
  },
  dataZoom: {
    type: Boolean,
    default: false
  },
  legend: {
    type: Boolean,
    default: true
  },
  legendPosition: {
    type: String,
    default: 'top'
  },
  tooltip: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String,
    default: 'light'
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
  },
  colors: {
    type: Array,
    default: () => ['#409eff', '#67c23a', '#f56c6c', '#e6a23c', '#909399']
  },
  markLine: {
    type: Object,
    default: () => ({})
  },
  markPoint: {
    type: Object,
    default: () => ({})
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  labelPosition: {
    type: String,
    default: 'top'
  }
})

const emit = defineEmits(['ready', 'click', 'dblclick', 'mouseover', 'mouseout', 'dataZoom', 'legendselectchanged', 'refresh'])

const chartRef = ref(null)

const defaultSeries = computed(() => {
  if (props.series.length > 0) {
    return props.series
  }

  return props.data.map((item, index) => ({
    name: item.name || `数据${index + 1}`,
    type: 'bar',
    barWidth: props.barWidth,
    barGap: props.barGap,
    barCategoryGap: props.barCategoryGap,
    stack: props.stack || undefined,
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: props.colors[index % props.colors.length] },
          { offset: 1, color: props.colors[index % props.colors.length] + '80' }
        ]
      },
      borderRadius: [4, 4, 0, 0]
    },
    label: props.showLabel ? {
      show: true,
      position: props.labelPosition,
      color: '#606266',
      fontSize: 12
    } : undefined,
    markLine: Object.keys(props.markLine).length > 0 ? props.markLine : undefined,
    markPoint: Object.keys(props.markPoint).length > 0 ? props.markPoint : undefined,
    data: item.data || []
  }))
})

const chartOption = computed(() => {
  const isDark = props.theme === 'dark'
  const textColor = isDark ? '#e0e0e0' : '#606266'
  const axisLineColor = isDark ? '#555' : '#dcdfe6'
  const splitLineColor = isDark ? '#333' : '#ebeef5'
  const tooltipBgColor = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)'
  const tooltipBorderColor = isDark ? '#555' : '#ebeef5'
  const tooltipTextColor = isDark ? '#e0e0e0' : '#303133'

  const xAxis = props.horizontal ? {
    type: 'value',
    name: props.yAxisName,
    axisLine: {
      lineStyle: {
        color: axisLineColor
      }
    },
    axisLabel: {
      color: textColor
    },
    splitLine: {
      lineStyle: {
        color: splitLineColor,
        type: 'dashed'
      }
    }
  } : {
    type: 'category',
    data: props.xAxisData,
    name: props.xAxisName,
    axisLine: {
      lineStyle: {
        color: axisLineColor
      }
    },
    axisLabel: {
      color: textColor,
      rotate: props.xAxisData.length > 8 ? 45 : 0
    },
    axisTick: {
      alignWithLabel: true
    }
  }

  const yAxis = props.horizontal ? {
    type: 'category',
    data: props.xAxisData,
    name: props.xAxisName,
    axisLine: {
      lineStyle: {
        color: axisLineColor
      }
    },
    axisLabel: {
      color: textColor
    }
  } : {
    type: 'value',
    name: props.yAxisName,
    axisLine: {
      show: true,
      lineStyle: {
        color: axisLineColor
      }
    },
    axisLabel: {
      color: textColor
    },
    splitLine: {
      lineStyle: {
        color: splitLineColor,
        type: 'dashed'
      }
    }
  }

  return {
    title: props.title ? {
      text: props.title,
      subtext: props.subtitle,
      left: 'center',
      textStyle: {
        color: isDark ? '#fff' : '#303133'
      }
    } : undefined,
    tooltip: props.tooltip ? {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: tooltipBgColor,
      borderColor: tooltipBorderColor,
      borderWidth: 1,
      textStyle: {
        color: tooltipTextColor
      }
    } : undefined,
    legend: props.legend ? {
      data: defaultSeries.value.map(s => s.name),
      top: props.legendPosition === 'top' ? 10 : undefined,
      bottom: props.legendPosition === 'bottom' ? 10 : undefined,
      left: props.legendPosition === 'left' ? 10 : undefined,
      right: props.legendPosition === 'right' ? 10 : undefined,
      textStyle: {
        color: textColor
      }
    } : undefined,
    grid: {
      left: '3%',
      right: '4%',
      bottom: props.dataZoom ? '15%' : '3%',
      top: props.title ? '15%' : '8%',
      containLabel: true
    },
    xAxis,
    yAxis,
    dataZoom: props.dataZoom ? [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        type: 'slider',
        start: 0,
        end: 100,
        height: 20,
        bottom: 10
      }
    ] : undefined,
    series: defaultSeries.value
  }
})

const handleReady = (instance) => {
  emit('ready', instance)
}

const handleClick = (params) => {
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

const handleRefresh = () => {
  emit('refresh')
}

defineExpose({
  resize: () => chartRef.value?.resize(),
  dispose: () => chartRef.value?.dispose(),
  toggleLoading: (loading) => chartRef.value?.toggleLoading(loading),
  updateOption: () => chartRef.value?.updateOption(),
  getOption: () => chartRef.value?.getOption(),
  setOption: (option, notMerge) => chartRef.value?.setOption(option, notMerge),
  getChartInstance: () => chartRef.value?.getChartInstance?.()
})
</script>