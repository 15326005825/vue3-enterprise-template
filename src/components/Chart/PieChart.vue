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
  radius: {
    type: [String, Array],
    default: '50%'
  },
  center: {
    type: Array,
    default: () => ['50%', '50%']
  },
  roseType: {
    type: String,
    default: ''
  },
  doughnut: {
    type: Boolean,
    default: false
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  labelPosition: {
    type: String,
    default: 'outside'
  },
  labelLine: {
    type: Boolean,
    default: true
  },
  legend: {
    type: Boolean,
    default: true
  },
  legendPosition: {
    type: String,
    default: 'right'
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
    default: () => ['#409eff', '#67c23a', '#f56c6c', '#e6a23c', '#909399', '#c0c4cc']
  },
  selectedMode: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['ready', 'click', 'dblclick', 'mouseover', 'mouseout', 'legendselectchanged', 'refresh'])

const chartRef = ref(null)

const defaultSeries = computed(() => {
  if (props.series.length > 0) {
    return props.series
  }

  const radius = props.doughnut ? ['40%', '70%'] : props.radius

  return [{
    name: props.title || '数据统计',
    type: 'pie',
    radius,
    center: props.center,
    roseType: props.roseType || undefined,
    selectedMode: props.selectedMode || undefined,
    label: props.showLabel ? {
      show: true,
      position: props.labelPosition,
      formatter: '{b}: {c} ({d}%)',
      color: '#606266',
      fontSize: 12
    } : {
      show: false
    },
    labelLine: props.labelLine ? {
      show: true,
      length: 15,
      length2: 10
    } : {
      show: false
    },
    itemStyle: {
      borderRadius: 4,
      borderColor: '#fff',
      borderWidth: 2
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      },
      label: {
        show: true,
        fontSize: 14,
        fontWeight: 'bold'
      }
    },
    data: props.data.map((item, index) => ({
      value: item.value,
      name: item.name,
      itemStyle: {
        color: props.colors[index % props.colors.length]
      }
    }))
  }]
})

const chartOption = computed(() => {
  const isDark = props.theme === 'dark'
  const textColor = isDark ? '#e0e0e0' : '#606266'
  const tooltipBgColor = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)'
  const tooltipBorderColor = isDark ? '#555' : '#ebeef5'
  const tooltipTextColor = isDark ? '#e0e0e0' : '#303133'

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
      trigger: 'item',
      backgroundColor: tooltipBgColor,
      borderColor: tooltipBorderColor,
      borderWidth: 1,
      textStyle: {
        color: tooltipTextColor
      },
      formatter: '{b}: {c} ({d}%)'
    } : undefined,
    legend: props.legend ? {
      orient: props.legendPosition === 'right' || props.legendPosition === 'left' ? 'vertical' : 'horizontal',
      top: props.legendPosition === 'top' ? 10 : undefined,
      bottom: props.legendPosition === 'bottom' ? 10 : undefined,
      left: props.legendPosition === 'left' ? 10 : undefined,
      right: props.legendPosition === 'right' ? 10 : undefined,
      data: props.data.map(item => item.name),
      textStyle: {
        color: textColor
      }
    } : undefined,
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