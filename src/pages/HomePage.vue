<template>
  <div class="space-y-8">
    <!-- Top analytic and AI cards -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Analytic board card -->
      <div
        class="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-gray-100 lg:col-span-2"
      >
        <div class="flex items-center justify-between border-b border-gray-50 px-8 py-6">
          <div class="text-lg font-semibold text-gray-900">用例执行趋势</div>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <span>范围</span>
            <select
              v-model.number="days"
              @change="loadStats"
              class="rounded-lg border-none bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600 focus:ring-0"
            >
              <option :value="7">近7天</option>
              <option :value="14">近14天</option>
              <option :value="30">近30天</option>
            </select>
          </div>
        </div>
        <div class="p-8">
          <TrendChart :data="dailyStats" @click-bar="handleChartClick" />
          <div class="mt-8 grid grid-cols-2 gap-4 text-center md:grid-cols-6">
            <div 
              v-for="m in funnelMetrics" 
              :key="m.label" 
              @click="navigateToExecutions(m.status)"
              class="cursor-pointer rounded-2xl bg-gray-50/50 py-4 transition-all hover:bg-white hover:shadow-md hover:scale-105 ring-1 ring-transparent hover:ring-gray-100"
            >
              <div class="text-2xl font-bold tracking-tight" :style="{ color: m.color }">{{ m.value }}</div>
              <div class="mt-1 text-xs font-medium text-gray-400 uppercase tracking-wide">{{ m.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Co-Pilot card -->
      <div class="relative flex flex-col overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <!-- Decorative background elements -->
        <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-50 blur-3xl opacity-60"></div>
        <div class="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-purple-50 blur-3xl opacity-60"></div>

        <div class="relative z-10">
          <div class="text-xs font-bold uppercase tracking-widest text-gray-400">The</div>
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold text-gray-900">AI Co-Pilot</span>
            <span class="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-2 py-0.5 text-[10px] font-bold text-white">BETA</span>
          </div>
          <div class="mt-1 text-sm text-gray-500">Powered by AI</div>
          
          <!-- AI icon -->
          <div
            class="mt-8 flex h-40 items-center justify-center rounded-3xl bg-gradient-to-br from-white to-blue-50 shadow-inner ring-1 ring-blue-100/50 overflow-hidden relative"
          >
            <ParticleSphere class="absolute inset-0 z-0" />
            <div class="relative z-10 flex items-center justify-center">
              <span class="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient-x drop-shadow-lg">
                TRS
              </span>
            </div>
          </div>
          
          <!-- Data metrics -->
          <div class="mt-8 flex-1 space-y-4">
            <div class="flex items-center justify-between">
              <div class="text-sm font-medium text-gray-900">概览</div>
              <div class="text-xs text-gray-400">当前租户</div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div 
                @click="router.push('/test-cases')"
                class="cursor-pointer rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:scale-105"
              >
                <div class="text-xs font-medium text-gray-400 uppercase">已生成用例</div>
                <div class="mt-1 text-2xl font-bold text-gray-900">{{ stats.testCasesCount }}</div>
              </div>
              <div 
                @click="router.push('/scenarios')"
                class="cursor-pointer rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:scale-105"
              >
                <div class="text-xs font-medium text-gray-400 uppercase">场景数</div>
                <div class="mt-1 text-2xl font-bold text-gray-900">{{ stats.scenariosCount }}</div>
              </div>
            </div>

            <button 
              @click="openCreateTestCaseInNewWindow"
              class="mt-4 w-full rounded-xl bg-[#0F172A] py-3 text-sm font-medium text-white shadow-lg shadow-gray-900/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              新建用例
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats row -->

    <!-- Recent executions table -->
    <div>
      <div class="mb-4 flex items-center justify-between px-2">
        <h2 class="text-lg font-semibold text-gray-900">最近执行</h2>
        <button @click="router.push('/executions')" class="text-sm font-medium text-blue-600 hover:text-blue-700">查看全部</button>
      </div>
      
      <div class="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-gray-100">
        <table class="min-w-full">
          <thead class="bg-gray-50/50">
            <tr>
              <th class="px-8 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">测试名称</th>
              <th class="px-8 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">状态</th>
              <th class="px-8 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">步骤</th>
              <th class="px-8 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">耗时</th>
              <th class="px-8 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">时间</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="recentExecutions.length === 0">
              <td colspan="5" class="px-8 py-8 text-center text-gray-400">暂无执行记录</td>
            </tr>
            <tr v-for="exec in recentExecutions" :key="exec.executionId" class="group transition-colors hover:bg-gray-50/50">
              <td class="px-8 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    {{ exec.testCaseName.charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ exec.testCaseName }}</span>
                </div>
              </td>
              <td class="px-8 py-4">
                <div class="flex items-center gap-2">
                  <div 
                    class="h-2.5 w-2.5 rounded-full shadow-sm" 
                    :class="{
                      'bg-emerald-500 shadow-emerald-500/30': exec.status === 'success',
                      'bg-orange-500 shadow-orange-500/30': exec.status === 'failed',
                      'bg-red-500 shadow-red-500/30': exec.status === 'error',
                      'bg-blue-500 shadow-blue-500/30': exec.status === 'running',
                      'bg-gray-400 shadow-gray-400/30': exec.status === 'cancelled',
                      'bg-gray-300': !['success', 'failed', 'error', 'running', 'cancelled'].includes(exec.status)
                    }"
                  ></div>
                  <span class="text-xs font-medium text-gray-500 ml-1">{{ getStatusText(exec.status) }}</span>
                </div>
              </td>
              <td class="px-8 py-4 text-sm text-gray-500">
                {{ exec.passedSteps }}/{{ exec.totalSteps }}
              </td>
              <td class="px-8 py-4 text-sm text-gray-500 font-mono">{{ formatDuration(exec.duration) }}</td>
              <td class="px-8 py-4 text-sm text-gray-400">{{ formatDate(exec.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import ParticleSphere from '@/components/ParticleSphere.vue'
import TrendChart from '@/components/TrendChart.vue'
import { executionAPI, scenarioAPI, testCaseAPI, utils } from '@/utils/api'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 在新窗口打开测试用例页面并自动打开新建弹窗
const openCreateTestCaseInNewWindow = () => {
  const url = router.resolve({ name: 'TestCases', query: { create: 'true' } }).href
  window.open(url, '_blank')
}

const stats = ref({
  testCasesCount: 0,
  scenariosCount: 0,
  successCount: 0,
  failedCount: 0,
  successRate: 0,
})

const recentExecutions = ref([])
const loading = ref(false)
const days = ref(7)
const funnel = ref({ total: 0, success: 0, failed: 0, error: 0, queued: 0, running: 0 })
const dailyStats = ref([])

const funnelItems = computed(() => [
  { label: '总执行', value: funnel.value.total, color: '#6B7280', onClick: () => navigateToExecutions(null) },
  { label: '运行中', value: funnel.value.running, color: '#3B82F6', onClick: () => navigateToExecutions('running') },
  { label: '成功', value: funnel.value.success, color: '#10B981', onClick: () => navigateToExecutions('success') },
  { label: '失败', value: funnel.value.failed, color: '#F97316', onClick: () => navigateToExecutions('failed') },
  { label: '错误', value: funnel.value.error, color: '#EF4444', onClick: () => navigateToExecutions('error') },
])
const funnelMetrics = computed(() => [
  { label: '总执行', value: funnel.value.total, color: '#6B7280', status: null },
  { label: '成功', value: funnel.value.success, color: '#10B981', status: 'success' },
  { label: '失败', value: funnel.value.failed, color: '#F97316', status: 'failed' },
  { label: '错误', value: funnel.value.error, color: '#EF4444', status: 'error' },
  { label: '运行中', value: funnel.value.running, color: '#3B82F6', status: 'running' },
])

const formatDuration = (ms) => utils.formatDuration(ms)
const getStatusClass = (status) => utils.getStatusClass(status)
const getStatusText = (status) => utils.getStatusText(status)

const navigateToExecutions = (status) => {
  if (status) {
    router.push({ path: '/executions', query: { status } })
  } else {
    router.push('/executions')
  }
}

const handleChartClick = ({ date, status }) => {
  if (date) {
    router.push({
      path: '/executions',
      query: {
        status,
        date
      }
    })
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '-'
  }
}

const loadData = async () => {
  loading.value = true
  try {
    // 加载测试用例数
    const testCasesRes = await testCaseAPI.getAll({ limit: 1000 })
    stats.value.testCasesCount = testCasesRes.pagination?.total || 0

    // 加载场景数
    const scenariosRes = await scenarioAPI.list({ limit: 1000 })
    console.log('Scenarios response:', scenariosRes)
    stats.value.scenariosCount = scenariosRes.pagination?.total || 0

    // 加载最近执行
    const executionsRes = await executionAPI.getRecent({ limit: 5, status: null })
    recentExecutions.value = executionsRes.data || []

    // 计算统计（基于最近5条，仅用于头部指标的即时感知）
    stats.value.successCount = recentExecutions.value.filter((e) => e.status === 'success').length
    stats.value.failedCount = recentExecutions.value.filter((e) => e.status === 'failed').length

    const total = recentExecutions.value.length
    stats.value.successRate = total > 0 ? Math.round((stats.value.successCount / total) * 100) : 0
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const res = await executionAPI.getOverallStats({ days: days.value })
    const s = res.data || {}
    funnel.value = {
      total: s.total || 0,
      success: s.success || 0,
      failed: s.failed || 0,
      error: s.error || 0,
      queued: s.queued || 0,
      running: s.running || 0,
    }
    dailyStats.value = s.dailyStats || []
  } catch (e) {
    // 安全降级
    funnel.value = { total: 0, success: 0, failed: 0, error: 0, queued: 0, running: 0 }
    dailyStats.value = []
  }
}

let refreshTimer = null

onMounted(() => {
  loadData()
  loadStats()
  // 每30秒刷新一次
  refreshTimer = setInterval(() => {
    loadData()
    loadStats()
  }, 30000)
})

// 组件卸载时清理定时器
onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script>
