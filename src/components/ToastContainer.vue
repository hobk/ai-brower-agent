<template>
  <div class="pointer-events-none fixed left-1/2 top-4 z-[9999] flex w-full max-w-md -translate-x-1/2 flex-col gap-2">
    <transition-group name="toast" tag="div">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto mb-2 flex items-center gap-3 rounded-xl bg-white p-4 shadow-lg ring-1 ring-gray-200"
      >
        <component :is="iconFor(t.type)" :class="['h-5 w-5 flex-shrink-0', iconClass(t.type)]" />
        <div class="min-w-0 flex-1 text-sm font-medium text-gray-800">{{ t.message }}</div>
        <button
          class="flex-shrink-0 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          @click="remove(t.id)"
          aria-label="Close"
        >
          <XMarkIcon class="h-4 w-4" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { remove, toasts } from '@/utils/toast'
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon,
} from '@heroicons/vue/24/outline'

const iconFor = (type) => {
  return (
    {
      success: CheckCircleIcon,
      error: ExclamationCircleIcon,
      info: InformationCircleIcon,
      warning: ExclamationTriangleIcon,
    }[type] || InformationCircleIcon
  )
}

const iconClass = (type) =>
  ({
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
  })[type] || 'text-gray-500'

const dotClass = (type) =>
  ({
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  })[type] || 'bg-gray-400'
</script>

<style scoped>
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.toast-enter-active,
.toast-leave-active {
  transition: all 150ms ease;
}
</style>
