import axios from 'axios'

// 简单的 Token 存取
export const authToken = {
  get: () => localStorage.getItem('auth_token'),
  set: (t) => localStorage.setItem('auth_token', t),
  clear: () => localStorage.removeItem('auth_token'),
}

// 支持在子路径部署场景：优先使用运行时注入的 window.__BASE_PATH__，其次使用 Vite 的 import.meta.env.BASE_URL
const runtimeBase =
  typeof window !== 'undefined' && window.__BASE_PATH__ ? window.__BASE_PATH__ : undefined
const viteBase = 'https://llmys.trscd.com.cn/autotest/api/'

const instance = axios.create({
  baseURL: viteBase,
  timeout: 360 * 1000, // 360 秒超时
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截：自动附加 Authorization 头
instance.interceptors.request.use((config) => {
  const token = authToken.get()
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message
    console.error('API Error:', message)
    if (error.response?.status === 401) {
    }
    return Promise.reject(error)
  }
)

// ============== 测试用例 API ==============

export const testCaseAPI = {
  // 检查名称是否存在
  checkNameExists: (name, excludeId = null) => {
    const params = excludeId ? { excludeId } : {}
    return instance.get(`/test-cases/check-name/${encodeURIComponent(name)}`, { params })
  },

  // 获取所有分类
  getCategories: () => instance.get('/test-cases/categories'),

  // 创建测试用例
  create: (data) => instance.post('/test-cases', data),

  // 获取所有测试用例
  getAll: (params = {}) => instance.get('/test-cases', { params }),

  // 获取单个测试用例
  getById: (id) => instance.get(`/test-cases/${id}`),

  // 更新测试用例
  update: (id, data) => instance.put(`/test-cases/${id}`, data),

  // 删除测试用例
  delete: (id) => instance.delete(`/test-cases/${id}`),

  // 重新生成步骤
  regenerateSteps: (id) => instance.post(`/test-cases/${id}/regenerate-steps`),

  // 执行测试
  execute: (id) => instance.post(`/executions/test-cases/${id}/execute`),
}

// ============== 调试 API ==============
export const debugAPI = {
  start: (initialUrl) => instance.post('/debug/start', { initialUrl }),
  status: (sessionId) => instance.get(`/debug/${sessionId}/status`),
  executeStep: (sessionId, step, stepIndex) =>
    instance.post(`/debug/${sessionId}/step`, { step, stepIndex }),
  stop: (sessionId) => instance.delete(`/debug/${sessionId}`),
  getScreenshotUrl: (sessionId) => `${apiBase}/debug/${sessionId}/screenshot`.replace(/\/\/+/, '/'),
}

// ============== 执行 API ==============

export const executionAPI = {
  // 获取执行状态和详情
  getStatus: (executionId) => instance.get(`/executions/${executionId}`),
  // 获取执行详情
  getDetails: (executionId) => instance.get(`/executions/${executionId}/details`),

  // 获取执行历史
  getHistory: (testCaseId, params = {}) =>
    instance.get(`/executions/test-cases/${testCaseId}/history`, { params }),

  // 获取最近的执行
  getRecent: (params = {}) => instance.get('/executions', { params }),

  // 获取执行统计
  getStats: (testCaseId, params = {}) =>
    instance.get(`/executions/test-cases/${testCaseId}/stats`, { params }),

  // 获取整体执行统计（无 testCaseId）
  getOverallStats: (params = {}) => instance.get('/executions/stats', { params }),

  // 重试执行
  retry: (executionId) => instance.post(`/executions/${executionId}/retry`),

  // 停止执行
  stop: (executionId) => instance.post(`/executions/${executionId}/stop`),
}

// ============== 认证与用户 API ==============

export const authAPI = {
  login: (data) => instance.post('/auth/login', data),
  register: (data) => instance.post('/auth/register', data),
  me: () => instance.get('/auth/me'),
}

export const userAPI = {
  list: (params = {}) => instance.get('/users', { params }),
  get: (id) => instance.get(`/users/${id}`),
  create: (data) => instance.post('/users', data),
  update: (id, data) => instance.put(`/users/${id}`, data),
  updatePassword: (id, password) => instance.patch(`/users/${id}/password`, { password }),
  delete: (id) => instance.delete(`/users/${id}`),
}

// ============== 系统配置 API ==============

export const systemConfigAPI = {
  get: () => instance.get('/system-config'),
  update: (data) => instance.put('/system-config', data),
  testAndSaveLLM: (llm) => instance.post('/system-config/test-and-save-llm', { llm }),
  testSMTP: (smtp, testEmail) => instance.post('/system-config/test-smtp', { smtp, testEmail }),
  validateCron: (cron) => instance.post('/system-config/validate-cron', { cron }),
}

// ============== 场景编排 API ==============

export const scenarioAPI = {
  create: (data) => instance.post('/scenarios', data),
  list: (params = {}) => instance.get('/scenarios', { params }),
  get: (id) => instance.get(`/scenarios/${id}`),
  update: (id, data) => instance.put(`/scenarios/${id}`, data),
  delete: (id) => instance.delete(`/scenarios/${id}`),
  checkName: (name, excludeId) => instance.get('/scenarios/check-name', { params: { name, excludeId } }),
  execute: (id, options = {}) => {
    // 如果没有指定 mode，则不传参数让后端使用默认的 merged 模式
    const params = {}
    if (options.mode) {
      params.mode = options.mode
    }
    // 发送空对象而非 null，避免后端 body-parser(strict) 对 JSON 原始值报错
    return instance.post(`/scenarios/${id}/execute`, {}, { params })
  },
  history: (id, params = {}) => instance.get(`/scenarios/${id}/history`, { params }),
  details: (scenarioExecutionId) =>
    instance.get(`/scenarios/executions/${scenarioExecutionId}/details`),
  stop: (scenarioExecutionId) =>
    instance.post(`/scenarios/executions/${scenarioExecutionId}/stop`),
}

// ============== 系统日志 API ==============

export const logsAPI = {
  // 获取日志文件列表
  list: () => instance.get('/logs'),
  // 获取日志内容
  getContent: (filename, params = {}) => instance.get(`/logs/${filename}`, { params }),
  // 下载日志文件
  download: async (filename) => {
    const url = `${apiBase}/logs/${filename}/download`
    const token = authToken.get()

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('下载失败')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('下载日志文件失败:', error)
      throw error
    }
  },
}

// ============== 文件 API ==============

export const fileAPI = {
  upload: (formData) =>
    instance.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
}

// ============== 工具函数 ==============

export const utils = {
  // 等待执行完成
  async waitForExecution(executionId, timeout = 60000) {
    const startTime = Date.now()
    const pollInterval = 1000

    while (Date.now() - startTime < timeout) {
      try {
        const execution = await executionAPI.getStatus(executionId)
        if (['success', 'failed', 'error'].includes(execution.data.status)) {
          return execution
        }
        await new Promise((resolve) => setTimeout(resolve, pollInterval))
      } catch (error) {
        console.error('Error checking execution:', error)
        throw error
      }
    }

    throw new Error(`Execution timeout after ${timeout}ms`)
  },

  // 格式化执行时长
  formatDuration(ms) {
    if (!ms) return '0ms'
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  },

  // 获取状态标签类名
  getStatusClass(status) {
    const classes = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      error: 'bg-red-100 text-red-800',
      running: 'bg-blue-100 text-blue-800',
      queued: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-gray-100 text-gray-600',
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  },

  // 获取状态“图标”占位（不使用 emoji，返回简写字符串）
  getStatusIcon(status) {
    const icons = {
      success: 'OK',
      failed: 'FAIL',
      error: 'ERR',
      running: 'RUN',
      queued: 'WAIT',
      pending: 'PEND',
      cancelled: 'CANCEL',
    }
    return icons[status] || ''
  },

  // 获取状态中文描述
  getStatusText(status) {
    const text = {
      success: '成功',
      failed: '失败',
      error: '错误',
      running: '运行中',
      queued: '排队中',
      pending: '待执行',
      cancelled: '已取消',
    }
    return text[status] || status
  },
}

export default instance
