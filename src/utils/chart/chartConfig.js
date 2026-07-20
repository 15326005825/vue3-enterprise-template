export const defaultColors = [
  '#409eff',
  '#67c23a',
  '#f56c6c',
  '#e6a23c',
  '#909399',
  '#c0c4cc',
  '#7232dd',
  '#39c5cf',
  '#f09a37',
  '#6366f1'
]

export const lightTheme = {
  backgroundColor: 'transparent',
  textColor: '#303133',
  titleColor: '#303133',
  axisLineColor: '#dcdfe6',
  splitLineColor: '#ebeef5',
  tooltipBgColor: 'rgba(255, 255, 255, 0.95)',
  tooltipBorderColor: '#ebeef5',
  legendTextColor: '#606266'
}

export const darkTheme = {
  backgroundColor: '#1a1a2e',
  textColor: '#e0e0e0',
  titleColor: '#fff',
  axisLineColor: '#555',
  splitLineColor: '#333',
  tooltipBgColor: 'rgba(0, 0, 0, 0.8)',
  tooltipBorderColor: '#555',
  legendTextColor: '#e0e0e0'
}

export const getTheme = (theme) => {
  return theme === 'dark' ? darkTheme : lightTheme
}

export const createLineOption = (options) => {
  const {
    title = '',
    subtitle = '',
    xAxisData = [],
    series = [],
    smooth = false,
    showArea = false,
    showPoint = true,
    dataZoom = false,
    legend = true,
    colors = defaultColors,
    xAxisName = '',
    yAxisName = ''
  } = options

  return {
    title: title ? {
      text: title,
      subtext: subtitle,
      left: 'center',
      textStyle: {
        color: '#303133'
      }
    } : undefined,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ebeef5',
      borderWidth: 1,
      textStyle: {
        color: '#303133'
      },
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: legend ? {
      data: series.map(s => s.name),
      top: 10,
      textStyle: {
        color: '#606266'
      }
    } : undefined,
    grid: {
      left: '3%',
      right: '4%',
      bottom: dataZoom ? '15%' : '3%',
      top: title ? '15%' : '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      name: xAxisName,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266',
        rotate: xAxisData.length > 8 ? 45 : 0
      },
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266'
      },
      splitLine: {
        lineStyle: {
          color: '#ebeef5',
          type: 'dashed'
        }
      }
    },
    dataZoom: dataZoom ? [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider', start: 0, end: 100, height: 20, bottom: 10 }
    ] : undefined,
    series: series.map((item, index) => ({
      name: item.name,
      type: 'line',
      smooth,
      showSymbol: showPoint,
      lineStyle: { width: 2 },
      areaStyle: showArea ? {
        opacity: 0.1,
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: colors[index % colors.length] },
            { offset: 1, color: 'transparent' }
          ]
        }
      } : undefined,
      itemStyle: { color: colors[index % colors.length] },
      data: item.data
    }))
  }
}

export const createBarOption = (options) => {
  const {
    title = '',
    subtitle = '',
    xAxisData = [],
    series = [],
    stack = '',
    barWidth = 'auto',
    horizontal = false,
    dataZoom = false,
    legend = true,
    colors = defaultColors,
    showLabel = false,
    xAxisName = '',
    yAxisName = ''
  } = options

  const xAxis = horizontal ? {
    type: 'value',
    name: yAxisName,
    axisLine: { lineStyle: { color: '#dcdfe6' } },
    axisLabel: { color: '#606266' },
    splitLine: { lineStyle: { color: '#ebeef5', type: 'dashed' } }
  } : {
    type: 'category',
    data: xAxisData,
    name: xAxisName,
    axisLine: { lineStyle: { color: '#dcdfe6' } },
    axisLabel: { color: '#606266', rotate: xAxisData.length > 8 ? 45 : 0 },
    axisTick: { alignWithLabel: true }
  }

  const yAxis = horizontal ? {
    type: 'category',
    data: xAxisData,
    name: xAxisName,
    axisLine: { lineStyle: { color: '#dcdfe6' } },
    axisLabel: { color: '#606266' }
  } : {
    type: 'value',
    name: yAxisName,
    axisLine: { show: true, lineStyle: { color: '#dcdfe6' } },
    axisLabel: { color: '#606266' },
    splitLine: { lineStyle: { color: '#ebeef5', type: 'dashed' } }
  }

  return {
    title: title ? {
      text: title,
      subtext: subtitle,
      left: 'center',
      textStyle: { color: '#303133' }
    } : undefined,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ebeef5',
      borderWidth: 1,
      textStyle: { color: '#303133' }
    },
    legend: legend ? {
      data: series.map(s => s.name),
      top: 10,
      textStyle: { color: '#606266' }
    } : undefined,
    grid: {
      left: '3%',
      right: '4%',
      bottom: dataZoom ? '15%' : '3%',
      top: title ? '15%' : '8%',
      containLabel: true
    },
    xAxis,
    yAxis,
    dataZoom: dataZoom ? [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider', start: 0, end: 100, height: 20, bottom: 10 }
    ] : undefined,
    series: series.map((item, index) => ({
      name: item.name,
      type: 'bar',
      barWidth,
      stack: stack || undefined,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: colors[index % colors.length] },
            { offset: 1, color: colors[index % colors.length] + '80' }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      },
      label: showLabel ? {
        show: true,
        position: horizontal ? 'right' : 'top',
        color: '#606266',
        fontSize: 12
      } : undefined,
      data: item.data
    }))
  }
}

export const createPieOption = (options) => {
  const {
    title = '',
    subtitle = '',
    data = [],
    radius = '50%',
    center = ['50%', '50%'],
    roseType = '',
    doughnut = false,
    showLabel = true,
    legend = true,
    legendPosition = 'right',
    colors = defaultColors
  } = options

  const pieRadius = doughnut ? ['40%', '70%'] : radius

  return {
    title: title ? {
      text: title,
      subtext: subtitle,
      left: 'center',
      textStyle: { color: '#303133' }
    } : undefined,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ebeef5',
      borderWidth: 1,
      textStyle: { color: '#303133' },
      formatter: '{b}: {c} ({d}%)'
    },
    legend: legend ? {
      orient: legendPosition === 'right' || legendPosition === 'left' ? 'vertical' : 'horizontal',
      top: legendPosition === 'top' ? 10 : undefined,
      bottom: legendPosition === 'bottom' ? 10 : undefined,
      left: legendPosition === 'left' ? 10 : undefined,
      right: legendPosition === 'right' ? 10 : undefined,
      data: data.map(item => item.name),
      textStyle: { color: '#606266' }
    } : undefined,
    series: [{
      name: title || '数据统计',
      type: 'pie',
      radius: pieRadius,
      center,
      roseType: roseType || undefined,
      label: showLabel ? {
        show: true,
        position: 'outside',
        formatter: '{b}: {c} ({d}%)',
        color: '#606266',
        fontSize: 12
      } : { show: false },
      labelLine: { show: true, length: 15, length2: 10 },
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        label: { show: true, fontSize: 14, fontWeight: 'bold' }
      },
      data: data.map((item, index) => ({
        value: item.value,
        name: item.name,
        itemStyle: { color: colors[index % colors.length] }
      }))
    }]
  }
}

export const createMapOption = (options) => {
  const {
    title = '',
    subtitle = '',
    data = [],
    mapName = 'china',
    zoom = 1,
    center = [104.114129, 37.550339],
    roam = true,
    showLabel = true,
    legend = true,
    legendPosition = 'right',
    visualMap = true,
    visualMapMin = 0,
    visualMapMax = 1000,
    visualMapColor = ['#5470c6', '#91cc75', '#fac858', '#ee6666']
  } = options

  return {
    title: title ? {
      text: title,
      subtext: subtitle,
      left: 'center',
      textStyle: { color: '#303133' }
    } : undefined,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ebeef5',
      borderWidth: 1,
      textStyle: { color: '#303133' },
      formatter: (params) => {
        if (params.seriesType === 'map') {
          return `<div>${params.name}</div><div>数值: ${params.value || 0}</div>`
        }
        return ''
      }
    },
    legend: legend ? {
      orient: legendPosition === 'right' || legendPosition === 'left' ? 'vertical' : 'horizontal',
      top: legendPosition === 'top' ? 10 : undefined,
      bottom: legendPosition === 'bottom' ? 10 : undefined,
      left: legendPosition === 'left' ? 10 : undefined,
      right: legendPosition === 'right' ? 10 : undefined,
      textStyle: { color: '#606266' }
    } : undefined,
    visualMap: visualMap ? {
      min: visualMapMin,
      max: visualMapMax,
      left: legendPosition === 'left' ? '20%' : '5%',
      top: 'center',
      text: ['高', '低'],
      textStyle: { color: '#606266' },
      inRange: { color: visualMapColor }
    } : undefined,
    series: [{
      name: title || '地图数据',
      type: 'map',
      map: mapName,
      zoom,
      center,
      roam,
      label: showLabel ? {
        show: true,
        position: 'bottom',
        color: '#333',
        fontSize: 12
      } : { show: false },
      itemStyle: { areaColor: '#fff', borderColor: '#dcdfe6', borderWidth: 1 },
      emphasis: {
        itemStyle: { areaColor: '#409eff', borderColor: '#409eff', borderWidth: 2 },
        label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#fff' }
      },
      data
    }]
  }
}

export const generateMockData = (type, options = {}) => {
  const {
    count = 7,
    min = 0,
    max = 100,
    prefix = '数据'
  } = options

  const labels = Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`)

  const generateValue = () => Math.floor(Math.random() * (max - min + 1)) + min

  if (type === 'line' || type === 'bar') {
    return {
      xAxisData: labels,
      series: [{
        name: '系列1',
        data: Array.from({ length: count }, generateValue)
      }, {
        name: '系列2',
        data: Array.from({ length: count }, generateValue)
      }]
    }
  }

  if (type === 'pie') {
    return {
      data: labels.map((label, index) => ({
        name: label,
        value: generateValue()
      }))
    }
  }

  if (type === 'map') {
    const provinces = ['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆']
    return {
      data: provinces.map(name => ({
        name,
        value: generateValue()
      }))
    }
  }

  return {}
}