<template>
  <div class="chart-group" :class="groupClass">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, ref, provide, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  groupName: {
    type: String,
    default: 'chartGroup'
  },
  syncTooltip: {
    type: Boolean,
    default: false
  },
  syncHighlight: {
    type: Boolean,
    default: true
  },
  syncDataZoom: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    default: 'light'
  }
})

const emit = defineEmits(['sync', 'dataZoom'])

const charts = ref([])

const groupClass = computed(() => ({
  'dark-theme': props.theme === 'dark'
}))

const registerChart = (chartInstance) => {
  if (chartInstance && !charts.value.includes(chartInstance)) {
    charts.value.push(chartInstance)
    chartInstance.group = props.groupName
    bindChartEvents(chartInstance)
  }
}

const unregisterChart = (chartInstance) => {
  const index = charts.value.indexOf(chartInstance)
  if (index > -1) {
    charts.value.splice(index, 1)
  }
}

const bindChartEvents = (chartInstance) => {
  if (props.syncHighlight) {
    chartInstance.on('highlight', (params) => {
      echarts.dispatchAction({
        type: 'highlight',
        seriesIndex: params.seriesIndex,
        dataIndex: params.dataIndex,
        name: params.name,
        group: props.groupName
      })
      emit('sync', {
        type: 'highlight',
        params
      })
    })

    chartInstance.on('downplay', (params) => {
      echarts.dispatchAction({
        type: 'downplay',
        seriesIndex: params.seriesIndex,
        dataIndex: params.dataIndex,
        name: params.name,
        group: props.groupName
      })
      emit('sync', {
        type: 'downplay',
        params
      })
    })
  }

  if (props.syncTooltip) {
    chartInstance.on('mouseover', (params) => {
      charts.value.forEach(c => {
        if (c !== chartInstance) {
          c.dispatchAction({
            type: 'showTip',
            seriesIndex: params.seriesIndex,
            dataIndex: params.dataIndex,
            name: params.name
          })
        }
      })
    })

    chartInstance.on('mouseout', () => {
      charts.value.forEach(c => {
        c.dispatchAction({
          type: 'hideTip'
        })
      })
    })
  }

  if (props.syncDataZoom) {
    chartInstance.on('dataZoom', (params) => {
      charts.value.forEach(c => {
        if (c !== chartInstance) {
          c.dispatchAction({
            type: 'dataZoom',
            start: params.start,
            end: params.end
          })
        }
      })
      emit('dataZoom', params)
    })
  }
}

const highlightAll = (dataIndex, seriesIndex) => {
  echarts.dispatchAction({
    type: 'highlight',
    seriesIndex,
    dataIndex,
    group: props.groupName
  })
}

const downplayAll = () => {
  echarts.dispatchAction({
    type: 'downplay',
    group: props.groupName
  })
}

const showTipAll = (dataIndex, seriesIndex) => {
  charts.value.forEach(c => {
    c.dispatchAction({
      type: 'showTip',
      seriesIndex,
      dataIndex
    })
  })
}

const hideTipAll = () => {
  charts.value.forEach(c => {
    c.dispatchAction({
      type: 'hideTip'
    })
  })
}

const resizeAll = () => {
  charts.value.forEach(c => {
    c.resize()
  })
}

const disposeAll = () => {
  charts.value.forEach(c => {
    c.dispose()
  })
  charts.value = []
}

provide('chartGroup', {
  registerChart,
  unregisterChart,
  groupName: props.groupName
})

onUnmounted(() => {
  disposeAll()
})

defineExpose({
  charts,
  registerChart,
  unregisterChart,
  highlightAll,
  downplayAll,
  showTipAll,
  hideTipAll,
  resizeAll,
  disposeAll
})
</script>

<style lang="scss" scoped>
.chart-group {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
}

.dark-theme {
  background-color: #1a1a2e;
}
</style>