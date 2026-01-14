<template>
  <div ref="chartRef" class="h-64 w-full"></div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
// 尝试动态导入 echarts，如果失败则不渲染或提示
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['click-bar'])

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  
  chartInstance.on('click', (params) => {
    if (params.componentType === 'series') {
      const index = params.dataIndex
      const rawData = props.data[index]
      if (rawData) {
        const statusMap = {
          '成功': 'success',
          '失败': 'failed',
          '错误': 'error'
        }
        emits('click-bar', {
          date: rawData.date,
          status: statusMap[params.seriesName] || ''
        })
      }
    }
  })

  updateChart()
  window.addEventListener('resize', resizeChart)
}

const resizeChart = () => {
  chartInstance?.resize()
}

const updateChart = () => {
  if (!chartInstance || !props.data.length) return

  const parseDateOnlyLocal = (s) => {
    if (!s || typeof s !== 'string') return null
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (!m) return null
    const y = parseInt(m[1], 10)
    const mo = parseInt(m[2], 10)
    const d = parseInt(m[3], 10)
    return new Date(y, mo - 1, d, 0, 0, 0, 0)
  }

  const dates = props.data.map((item) => {
    const d = parseDateOnlyLocal(item.date) || new Date(item.date)
    return `${d.getMonth() + 1}/${d.getDate()}`
  })

  const successData = props.data.map((item) => item.success)
  const failedData = props.data.map((item) => item.failed)
  const errorData = props.data.map((item) => item.error)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#E5E7EB',
      textStyle: {
        color: '#374151',
      },
    },
    legend: {
      data: ['成功', '失败', '错误'],
      bottom: 0,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: '#6B7280',
        fontSize: 12,
      },
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '10%',
      top: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: dates,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        margin: 10,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#F3F4F6',
          type: 'dashed',
        },
      },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 10,
      },
    },
    series: [
      {
        name: '成功',
        type: 'bar',
        stack: 'Total',
        barWidth: '40%',
        itemStyle: { 
          color: '#10B981',
          borderRadius: [0, 0, 4, 4] // 底部圆角
        },
        emphasis: { focus: 'series' },
        data: successData
      },
      {
        name: '失败',
        type: 'bar',
        stack: 'Total',
        barWidth: '40%',
        itemStyle: { color: '#F97316' },
        emphasis: { focus: 'series' },
        data: failedData
      },
      {
        name: '错误',
        type: 'bar',
        stack: 'Total',
        barWidth: '40%',
        itemStyle: { 
          color: '#EF4444',
          borderRadius: [4, 4, 0, 0] // 顶部圆角
        },
        emphasis: { focus: 'series' },
        data: errorData,
      },
    ],
  }

  chartInstance.setOption(option)
}

watch(
  () => props.data,
  () => {
    nextTick(() => {
      updateChart()
    })
  },
  { deep: true }
)

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})
</script>
