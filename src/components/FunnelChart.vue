<template>
  <div class="w-full">
    <div
      v-if="!items || items.length === 0"
      class="flex h-48 items-center justify-center text-gray-400"
    >
      无数据
    </div>
    <div v-else class="space-y-2">
      <div
        v-for="(it, i) in normalizedSorted"
        :key="i"
        class="group relative mx-auto h-10"
        :class="{ 'cursor-pointer': !!it.onClick }"
        :style="{ minWidth: minWidthPx + 'px' }"
        :title="`${it.label}: ${it.value}（${it.percent}%）`"
        @click="it.onClick ? it.onClick(it) : null"
      >
        <!-- 可视化条形（严格按比例宽度） -->
        <div
          class="absolute inset-y-0 left-1/2 -translate-x-1/2 rounded-xl transition-all duration-150"
          :class="{ 'group-hover:shadow-lg group-hover:brightness-110 group-hover:scale-[1.02]': !!it.onClick, 'group-hover:shadow-md group-hover:brightness-105': !it.onClick }"
          :style="{
            width: it.percent + '%',
            background: it.bg,
            boxShadow: 'inset 0 -1px rgba(255,255,255,0.25)',
          }"
        />
        <!-- 覆盖在上层的文本：左侧标签 + 中间数值/百分比 -->
        <div class="pointer-events-none absolute inset-0 px-3 text-xs">
          <!-- 左侧标签（始终可读） -->
          <div class="absolute inset-y-0 left-3 flex items-center">
            <div class="truncate pr-2 text-gray-800">{{ it.label }}</div>
          </div>
          <!-- 中间数值与百分比（居中） -->
          <div class="absolute inset-y-0 left-1/2 flex -translate-x-1/2 items-center">
            <div class="text-gray-900">
              <span class="font-semibold">{{ it.value }}</span>
              <span class="ml-1 text-gray-700">({{ it.percent }}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  colors: {
    type: Array,
    default: () => [
      '#3B82F6', // blue-500
      '#60A5FA', // blue-400
      '#93C5FD', // blue-300
      '#BFDBFE', // blue-200
      '#DBEAFE', // blue-100
    ],
  },
  // 最小像素宽度，进一步保证在小屏/窄容器下仍可读
  minWidthPx: {
    type: Number,
    default: 220,
  },
})

const maxVal = computed(() => Math.max(1, ...props.items.map((x) => Number(x.value) || 0)))

const normalized = computed(() => {
  const c = props.colors
  return props.items.map((x, idx) => {
    const v = Number(x.value) || 0
    const width = Math.max(0, Math.round((v / maxVal.value) * 100))
    const col = x.color || c[idx % c.length]
    const bg = `linear-gradient(135deg, ${col} 0%, ${lighten(col, 0.2)} 100%)`
    const percent = Math.round((v / maxVal.value) * 100)
    return { ...x, width, bg, percent, _v: v }
  })
})

// 按数值从大到小排序（自顶向下）
const normalizedSorted = computed(() => {
  return [...normalized.value].sort((a, b) => b._v - a._v)
})

function lighten(hex, amt = 0.2) {
  try {
    const { r, g, b } = hexToRgb(hex)
    const lr = Math.round(r + (255 - r) * amt)
    const lg = Math.round(g + (255 - g) * amt)
    const lb = Math.round(b + (255 - b) * amt)
    return `rgb(${lr}, ${lg}, ${lb})`
  } catch {
    return hex
  }
}

function hexToRgb(hex) {
  const m = hex.replace('#', '')
  const bigint = parseInt(
    m.length === 3
      ? m
          .split('')
          .map((c) => c + c)
          .join('')
      : m,
    16
  )
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}
</script>

<style scoped></style>
