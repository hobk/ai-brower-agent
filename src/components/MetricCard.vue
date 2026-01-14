<template>
  <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
    <div class="text-xs uppercase tracking-wide text-gray-500">{{ label }}</div>
    <div class="mt-2 flex items-baseline gap-2">
      <div class="text-3xl font-bold" :class="valueClass">{{ value }}</div>
      <div v-if="suffix" class="text-sm text-gray-400">{{ suffix }}</div>
    </div>
    <div v-if="sub" class="mt-2 text-xs text-gray-500">{{ sub }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  label: String,
  value: [String, Number],
  suffix: String,
  sub: String,
  tone: { type: String, default: 'blue' },
})

const valueClass = computed(() => ({
  'text-blue-600': props.tone === 'blue',
  'text-green-600': props.tone === 'green',
  'text-red-600': props.tone === 'red',
  'text-yellow-600': props.tone === 'yellow',
}))
</script>
