<template>
  <div class="rounded-2xl bg-white/80 shadow-sm ring-1 ring-gray-100 backdrop-blur">
    <div
      v-if="title || $slots.header"
      class="flex items-center justify-between border-b border-gray-100 px-6 py-4"
    >
      <h3 v-if="title" class="text-sm font-semibold text-gray-900">{{ title }}</h3>
      <slot name="header" />
    </div>
    <div class="p-6">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' },
})
</script>
