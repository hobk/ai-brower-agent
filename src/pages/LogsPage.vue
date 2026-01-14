<template>
  <div class="h-full flex flex-col bg-white overflow-hidden px-6">

    <!-- 主体内容 -->
    <div class="flex-1 overflow-hidden flex flex-col min-h-0">
      <!-- 顶部工具栏 -->
      <div class="px-6 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div class="flex items-center gap-4 flex-wrap">
          <!-- 日志文件选择 -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">日志文件:</label>
            <select
              v-model="selectedFile"
              @change="loadLogContent"
              class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 min-w-[200px]"
            >
              <option v-if="loading" value="">加载中...</option>
              <option v-else-if="logFiles.length === 0" value="">暂无日志文件</option>
              <option
                v-for="file in logFiles"
                :key="file.name"
                :value="file.name"
              >
                {{ file.name }} ({{ formatFileSize(file.size) }})
              </option>
            </select>
            <button
              @click="loadLogFiles"
              class="text-sm px-2 py-1 text-gray-600 hover:text-gray-800"
              title="刷新文件列表"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>

          <div class="h-6 w-px bg-gray-300"></div>

          <!-- 日志级别筛选 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">级别:</label>
            <select
              v-model="filters.level"
              @change="loadLogContent"
              class="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="">全部</option>
              <option value="ERROR">ERROR</option>
              <option value="WARN">WARN</option>
              <option value="INFO">INFO</option>
              <option value="DEBUG">DEBUG</option>
            </select>
          </div>

          <!-- 关键词搜索 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">搜索:</label>
            <input
              v-model="filters.search"
              @keyup.enter="loadLogContent"
              placeholder="输入关键词后按回车"
              class="text-sm border border-gray-300 rounded px-2 py-1 w-48"
            />
          </div>

          <!-- 行数限制 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">最近:</label>
            <select
              v-model.number="filters.lines"
              @change="loadLogContent"
              class="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option :value="100">100 行</option>
              <option :value="500">500 行</option>
              <option :value="1000">1000 行</option>
              <option :value="5000">5000 行</option>
            </select>
          </div>

          <div class="flex-1"></div>

          <!-- 自动刷新开关 -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">自动刷新:</label>
            <button
              @click="toggleAutoRefresh"
              :class="[
                'text-sm px-3 py-1 rounded transition-colors',
                autoRefresh
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ autoRefresh ? '已开启' : '已关闭' }}
            </button>
          </div>

          <!-- 操作按钮 -->
          <button
            @click="loadLogContent"
            class="text-sm px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            刷新
          </button>
          <button
            @click="downloadLog"
            :disabled="!selectedFile"
            class="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下载
          </button>
        </div>
      </div>

      <!-- 日志内容显示区域 -->
      <div class="flex-1 min-h-0">
        <div v-if="!selectedFile" class="h-full flex items-center justify-center text-gray-400">
          <div class="text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="mt-2 text-sm">请在上方选择日志文件查看内容</p>
          </div>
        </div>

        <div v-else ref="logContainer" class="h-full overflow-y-auto p-6 bg-gray-900">
          <div v-if="loadingContent" class="text-center py-8 text-gray-400">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p class="mt-2 text-sm">加载中...</p>
          </div>
          <div v-else-if="contentError" class="text-center py-8 text-red-400">
            <p class="text-sm">{{ contentError }}</p>
          </div>
          <div v-else-if="logContent.length === 0" class="text-center py-8 text-gray-400">
            <p class="text-sm">没有匹配的日志内容</p>
          </div>
          <pre
            v-else
            class="font-mono text-xs text-gray-100 whitespace-pre-wrap break-all"
          >{{ logContent }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useToast } from '../composables/useToast'
import { logsAPI } from '../utils/api.js'

const { showToast } = useToast()

const loading = ref(false)
const error = ref(null)
const logFiles = ref([])
const selectedFile = ref(null)

const loadingContent = ref(false)
const contentError = ref(null)
const logContent = ref('')
const logContainer = ref(null)

const autoRefresh = ref(true)
let autoRefreshTimer = null

const filters = ref({
  level: '',
  search: '',
  lines: 500,
})

// 加载日志文件列表
const loadLogFiles = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await logsAPI.list()
    logFiles.value = res.data || []
    // 自动选中第一个文件
    if (logFiles.value.length > 0 && !selectedFile.value) {
      selectedFile.value = logFiles.value[0].name
      loadLogContent()
      // 默认开启自动刷新
      startAutoRefresh()
    }
  } catch (err) {
    error.value = err.response?.data?.message || '加载日志文件列表失败'
    showToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}

// 加载日志内容
const loadLogContent = async (scrollToBottom = false) => {
  if (!selectedFile.value) return

  // 自动刷新时不显示加载状态，避免闪烁
  if (!scrollToBottom) {
    loadingContent.value = true
  }
  contentError.value = null

  try {
    const params = {
      lines: filters.value.lines,
    }
    if (filters.value.level) params.level = filters.value.level
    if (filters.value.search) params.search = filters.value.search

    const res = await logsAPI.getContent(selectedFile.value, params)
    logContent.value = res.data || ''
    
    // 如果需要滚动到底部（自动刷新时）
    if (scrollToBottom && logContainer.value) {
      // 使用nextTick和requestAnimationFrame确保DOM更新后再滚动
      await nextTick()
      requestAnimationFrame(() => {
        if (logContainer.value) {
          logContainer.value.scrollTop = logContainer.value.scrollHeight
        }
      })
    }
  } catch (err) {
    contentError.value = err.response?.data?.message || '加载日志内容失败'
    if (!scrollToBottom) {
      showToast(contentError.value, 'error')
    }
  } finally {
    if (!scrollToBottom) {
      loadingContent.value = false
    }
  }
}

// 切换自动刷新
const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value
  
  if (autoRefresh.value) {
    // 开启自动刷新
    showToast('自动刷新已开启，每秒刷新一次', 'success')
    startAutoRefresh()
  } else {
    // 关闭自动刷新
    showToast('自动刷新已关闭', 'info')
    stopAutoRefresh()
  }
}

// 启动自动刷新
const startAutoRefresh = () => {
  if (autoRefreshTimer) return
  
  autoRefreshTimer = setInterval(() => {
    loadLogContent(true) // 自动刷新时滚动到底部
  }, 1000)
}

// 停止自动刷新
const stopAutoRefresh = () => {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
}

// 下载日志
const downloadLog = async () => {
  if (!selectedFile.value) {
    showToast('请先选择日志文件', 'warning')
    return
  }
  
  try {
    await logsAPI.download(selectedFile.value)
    showToast('下载成功', 'success')
  } catch (err) {
    showToast('下载失败', 'error')
  }
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date

  // 今天
  if (diffMs < 86400000 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  // 昨天
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth()) {
    return '昨天'
  }

  // 其他日期
  return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

onMounted(() => {
  loadLogFiles()
})

onUnmounted(() => {
  // 组件卸载时清理定时器
  stopAutoRefresh()
})
</script>
