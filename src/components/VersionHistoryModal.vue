<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="flex h-[90vh] w-full max-w-7xl flex-col rounded-lg bg-white shadow-xl">
      <!-- 标题栏 -->
      <div class="flex items-center justify-between border-b px-6 py-4">
        <h2 class="text-xl font-bold text-gray-900">版本历史: {{ testCase?.name }}</h2>
        <button
          @click="$emit('close')"
          class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- 主内容区 -->
      <div class="flex flex-1 overflow-hidden">
        <!-- 左侧：版本列表 -->
        <div class="w-80 flex-shrink-0 border-r bg-gray-50 overflow-y-auto">
          <div class="p-4">
            <div class="mb-4 text-sm text-gray-600">共 {{ versions.length }} 个版本</div>

            <div v-if="loading" class="flex justify-center py-8">
              <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="version in versions"
                :key="version._id"
                @click="toggleVersionSelection(version)"
                :class="[
                  'cursor-pointer rounded-lg border-2 p-3 transition-all',
                  selectedVersions.has(version.version)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300',
                ]"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-gray-900">版本 {{ version.version }}</span>
                    <span
                      v-if="version.version === versions[0]?.version"
                      class="rounded bg-blue-500 px-2 py-0.5 text-xs font-medium text-white"
                    >
                      当前版本
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    :checked="selectedVersions.has(version.version)"
                    @click.stop
                    @change="toggleVersionSelection(version)"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                </div>
                <div class="mt-2 text-xs text-gray-600">
                  <div>{{ version.modifiedByName }}</div>
                  <div>{{ formatDate(version.createdAt) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：版本内容展示 -->
        <div class="flex-1 overflow-auto bg-white p-6">
          <div
            v-if="selectedVersions.size === 0"
            class="flex h-full items-center justify-center text-gray-400"
          >
            <div class="text-center">
              <svg
                class="mx-auto mb-4 h-16 w-16"
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
              <p>请选择1-2个版本进行查看或对比</p>
            </div>
          </div>

          <div v-else-if="selectedVersions.size === 1">
            <!-- 单个版本展示 -->
            <div v-if="versionDetails[selectedVersionIds[0]]">
              <h3 class="mb-4 text-lg font-semibold">版本 {{ selectedVersionIds[0] }} 详情</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">名称</label>
                  <div class="mt-1 rounded-md bg-gray-50 p-3">
                    {{ versionDetails[selectedVersionIds[0]].snapshot.name }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">描述</label>
                  <div class="mt-1 rounded-md bg-gray-50 p-3">
                    {{ versionDetails[selectedVersionIds[0]].snapshot.description || '-' }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">自然语言描述</label>
                  <div class="mt-1 whitespace-pre-wrap rounded-md bg-gray-50 p-3">
                    {{
                      versionDetails[selectedVersionIds[0]].snapshot.naturalLanguageDescription ||
                      '-'
                    }}
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between">
                    <label class="block text-sm font-medium text-gray-700"
                      >步骤 ({{
                        versionDetails[selectedVersionIds[0]].snapshot.steps?.length || 0
                      }})</label
                    >
                    <button
                      @click="copySteps(versionDetails[selectedVersionIds[0]].snapshot.steps)"
                      class="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
                      title="复制步骤"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div class="mt-2 rounded-md bg-gray-50 p-3">
                    <pre class="text-xs">{{
                      JSON.stringify(versionDetails[selectedVersionIds[0]].snapshot.steps, null, 2)
                    }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="selectedVersions.size === 2">
            <!-- 两个版本对比 -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold">
                版本对比: v{{ selectedVersionIds[1] }} → v{{ selectedVersionIds[0] }}
              </h3>

              <!-- 名称对比 (仅在有差异时显示) -->
              <div v-if="hasDifference('name')" ref="nameDiff">
                <label class="mb-2 block text-sm font-medium text-gray-700">名称</label>
                <div class="grid grid-cols-2 gap-4">
                  <div class="rounded-md border border-red-200 bg-red-50 p-3">
                    <div class="mb-1 text-xs text-red-600">旧版本</div>
                    <div
                      v-html="highlightTextDiff(oldVersion?.name, newVersion?.name, 'old')"
                    ></div>
                  </div>
                  <div class="rounded-md border border-green-200 bg-green-50 p-3">
                    <div class="mb-1 text-xs text-green-600">新版本</div>
                    <div
                      v-html="highlightTextDiff(oldVersion?.name, newVersion?.name, 'new')"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- 描述对比 (仅在有差异时显示) -->
              <div v-if="hasDifference('description')" ref="descriptionDiff">
                <label class="mb-2 block text-sm font-medium text-gray-700">描述</label>
                <div class="grid grid-cols-2 gap-4">
                  <div class="rounded-md border border-red-200 bg-red-50 p-3">
                    <div class="mb-1 text-xs text-red-600">旧版本</div>
                    <div
                      v-html="
                        highlightTextDiff(
                          oldVersion?.description || '-',
                          newVersion?.description || '-',
                          'old'
                        )
                      "
                    ></div>
                  </div>
                  <div class="rounded-md border border-green-200 bg-green-50 p-3">
                    <div class="mb-1 text-xs text-green-600">新版本</div>
                    <div
                      v-html="
                        highlightTextDiff(
                          oldVersion?.description || '-',
                          newVersion?.description || '-',
                          'new'
                        )
                      "
                    ></div>
                  </div>
                </div>
              </div>

              <!-- 自然语言描述对比 (仅在有差异时显示) -->
              <div v-if="hasDifference('naturalLanguageDescription')" ref="nlDescriptionDiff">
                <label class="mb-2 block text-sm font-medium text-gray-700">自然语言描述</label>
                <div class="grid grid-cols-2 gap-4">
                  <div class="rounded-md border border-red-200 bg-red-50 p-3">
                    <div class="mb-1 text-xs text-red-600">旧版本</div>
                    <div
                      class="whitespace-pre-wrap"
                      v-html="
                        highlightTextDiff(
                          oldVersion?.naturalLanguageDescription || '-',
                          newVersion?.naturalLanguageDescription || '-',
                          'old'
                        )
                      "
                    ></div>
                  </div>
                  <div class="rounded-md border border-green-200 bg-green-50 p-3">
                    <div class="mb-1 text-xs text-green-600">新版本</div>
                    <div
                      class="whitespace-pre-wrap"
                      v-html="
                        highlightTextDiff(
                          oldVersion?.naturalLanguageDescription || '-',
                          newVersion?.naturalLanguageDescription || '-',
                          'new'
                        )
                      "
                    ></div>
                  </div>
                </div>
              </div>

              <!-- 步骤对比 (仅在有差异时显示) -->
              <div v-if="hasDifference('steps')" ref="stepsDiff">
                <label class="mb-2 block text-sm font-medium text-gray-700">步骤对比</label>
                <div class="rounded-md border p-4">
                  <div class="mb-3 text-sm text-gray-600">
                    步骤数: {{ oldVersion?.steps?.length || 0 }} →
                    {{ newVersion?.steps?.length || 0 }}
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="mb-2 flex items-center justify-between text-xs font-medium text-red-600">
                        <div>
                          旧版本步骤
                          <span class="ml-2 font-normal text-gray-500"
                            >{{ versionDetails[selectedVersionIds[1]]?.modifiedByName }} ·
                            {{ formatDate(versionDetails[selectedVersionIds[1]]?.createdAt) }}</span
                          >
                        </div>
                        <button
                          @click="copySteps(oldVersion?.steps)"
                          class="rounded px-2 py-1 text-blue-600 hover:bg-blue-50"
                          title="复制步骤"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div class="rounded bg-red-50 p-3 text-xs">
                        <pre
                          class="whitespace-pre-wrap"
                          v-html="
                            highlightTextDiff(
                              formatSteps(oldVersion?.steps),
                              formatSteps(newVersion?.steps),
                              'old'
                            )
                          "
                        ></pre>
                      </div>
                    </div>
                    <div>
                      <div class="mb-2 flex items-center justify-between text-xs font-medium text-green-600">
                        <div>
                          新版本步骤
                          <span class="ml-2 font-normal text-gray-500"
                            >{{ versionDetails[selectedVersionIds[0]]?.modifiedByName }} ·
                            {{ formatDate(versionDetails[selectedVersionIds[0]]?.createdAt) }}</span
                          >
                        </div>
                        <button
                          @click="copySteps(newVersion?.steps)"
                          class="rounded px-2 py-1 text-blue-600 hover:bg-blue-50"
                          title="复制步骤"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div class="rounded bg-green-50 p-3 text-xs">
                        <pre
                          class="whitespace-pre-wrap"
                          v-html="
                            highlightTextDiff(
                              formatSteps(oldVersion?.steps),
                              formatSteps(newVersion?.steps),
                              'new'
                            )
                          "
                        ></pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 无差异提示 -->
              <div
                v-if="!hasAnyDifference"
                class="rounded-lg bg-blue-50 p-6 text-center text-blue-700"
              >
                <svg
                  class="mx-auto mb-2 h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p class="font-medium">这两个版本完全相同，没有差异</p>
              </div>
            </div>
          </div>

          <div v-else class="flex h-full items-center justify-center text-gray-400">
            <p>最多只能选择2个版本进行对比</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import api from '../utils/api'

const props = defineProps({
  show: Boolean,
  testCase: Object,
})

const emit = defineEmits(['close'])

const versions = ref([])
const loading = ref(false)
const selectedVersions = ref(new Set())
const versionDetails = ref({})

const selectedVersionIds = computed(() => {
  return Array.from(selectedVersions.value).sort((a, b) => b - a)
})

// 获取旧版本和新版本
const oldVersion = computed(() => {
  if (selectedVersionIds.value.length !== 2) return null
  return versionDetails.value[selectedVersionIds.value[1]]?.snapshot
})

const newVersion = computed(() => {
  if (selectedVersionIds.value.length !== 2) return null
  return versionDetails.value[selectedVersionIds.value[0]]?.snapshot
})

// 检查字段是否有差异
const hasDifference = (field) => {
  if (!oldVersion.value || !newVersion.value) return false
  let oldVal = oldVersion.value[field]
  let newVal = newVersion.value[field]

  // 对于步骤，去掉 _id 后再比较
  if (field === 'steps' && Array.isArray(oldVal) && Array.isArray(newVal)) {
    oldVal = oldVal.map(({ _id, ...rest }) => rest)
    newVal = newVal.map(({ _id, ...rest }) => rest)
  }

  return JSON.stringify(oldVal) !== JSON.stringify(newVal)
}

// 检查是否有任何差异
const hasAnyDifference = computed(() => {
  if (!oldVersion.value || !newVersion.value) return false
  return ['name', 'description', 'naturalLanguageDescription', 'steps'].some((field) =>
    hasDifference(field)
  )
})

// 格式化步骤为可读字符串（去掉 _id 字段）
const formatSteps = (steps) => {
  if (!steps || steps.length === 0) return '-'
  // 去掉每个步骤的 _id 字段
  const stepsWithoutId = steps.map((step) => {
    const { _id, ...rest } = step
    return rest
  })
  return JSON.stringify(stepsWithoutId, null, 2)
}

// 文本差异高亮
const highlightTextDiff = (oldText, newText, type) => {
  if (!oldText) oldText = ''
  if (!newText) newText = ''

  // 如果完全相同，不需要高亮
  if (oldText === newText) {
    return escapeHtml(oldText)
  }

  // 简单的字符级diff算法
  const diffs = computeDiff(oldText.toString(), newText.toString())

  let result = ''
  for (const diff of diffs) {
    if (diff.type === 'equal') {
      result += escapeHtml(diff.value)
    } else if (diff.type === 'delete' && type === 'old') {
      result += `<span class="bg-red-300">${escapeHtml(diff.value)}</span>`
    } else if (diff.type === 'insert' && type === 'new') {
      result += `<span class="bg-green-300">${escapeHtml(diff.value)}</span>`
    }
  }

  return result
}

// 简单的字符diff算法 (动态规划)
const computeDiff = (oldText, newText) => {
  const m = oldText.length
  const n = newText.length
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0))

  // 计算最长公共子序列
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldText[i - 1] === newText[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // 回溯生成diff
  const diffs = []
  let i = m,
    j = n

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldText[i - 1] === newText[j - 1]) {
      diffs.unshift({ type: 'equal', value: oldText[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diffs.unshift({ type: 'insert', value: newText[j - 1] })
      j--
    } else {
      diffs.unshift({ type: 'delete', value: oldText[i - 1] })
      i--
    }
  }

  // 合并连续的相同类型
  const merged = []
  let current = null
  for (const diff of diffs) {
    if (!current || current.type !== diff.type) {
      if (current) merged.push(current)
      current = { type: diff.type, value: diff.value }
    } else {
      current.value += diff.value
    }
  }
  if (current) merged.push(current)

  return merged
}

// HTML转义
const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// refs for scrolling
const nameDiff = ref(null)
const descriptionDiff = ref(null)
const nlDescriptionDiff = ref(null)
const stepsDiff = ref(null)

// 自动滚动到第一个差异
const scrollToFirstDiff = () => {
  setTimeout(() => {
    const diffRefs = [nameDiff, descriptionDiff, nlDescriptionDiff, stepsDiff]
    for (const diffRef of diffRefs) {
      if (diffRef.value) {
        diffRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
        break
      }
    }
  }, 100)
}

// 加载版本历史
const loadVersions = async () => {
  if (!props.testCase?._id) return

  loading.value = true
  try {
    const res = await api.get(`/test-cases/${props.testCase._id}/versions`)
    versions.value = res.data || []

    // 默认选中最新两个版本
    if (versions.value.length >= 2) {
      selectedVersions.value = new Set([versions.value[0].version, versions.value[1].version])
      await loadVersionDetails(versions.value[0].version)
      await loadVersionDetails(versions.value[1].version)
      // 自动滚动到第一个差异
      scrollToFirstDiff()
    } else if (versions.value.length === 1) {
      selectedVersions.value = new Set([versions.value[0].version])
      await loadVersionDetails(versions.value[0].version)
    }
  } catch (error) {
    console.error('加载版本历史失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载版本详情
const loadVersionDetails = async (version) => {
  try {
    const res = await api.get(`/test-cases/${props.testCase._id}/versions/${version}`)
    versionDetails.value[version] = res.data
  } catch (error) {
    console.error(`加载版本 ${version} 详情失败:`, error)
  }
}

// 切换版本选择
const toggleVersionSelection = async (version) => {
  if (selectedVersions.value.has(version.version)) {
    selectedVersions.value.delete(version.version)
  } else {
    if (selectedVersions.value.size >= 2) {
      // 移除最旧的选择
      const oldest = Math.min(...selectedVersions.value)
      selectedVersions.value.delete(oldest)
    }
    selectedVersions.value.add(version.version)

    // 加载版本详情
    if (!versionDetails.value[version.version]) {
      await loadVersionDetails(version.version)
    }
  }
  selectedVersions.value = new Set(selectedVersions.value) // 触发响应式更新

  // 如果选中了2个版本，自动滚动到第一个差异
  if (selectedVersions.value.size === 2) {
    scrollToFirstDiff()
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

// 复制步骤
const copySteps = async (steps) => {
  if (!steps || steps.length === 0) {
    return
  }

  try {
    // 去掉 _id 字段
    const stepsWithoutId = steps.map((step) => {
      const { _id, ...rest } = step
      return rest
    })
    const stepsText = JSON.stringify(stepsWithoutId, null, 2)
    await navigator.clipboard.writeText(stepsText)
    
    // 可以添加一个成功提示（如果你有 toast 系统）
    console.log('步骤已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 监听弹窗打开
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      loadVersions()
    } else {
      // 关闭时清理
      versions.value = []
      selectedVersions.value = new Set()
      versionDetails.value = {}
    }
  }
)
</script>
