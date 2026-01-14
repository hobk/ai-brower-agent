import { reactive } from 'vue'

// Reactive toast store
export const toasts = reactive([])

let seed = 1

function push(type, message, options = {}) {
  const id = seed++
  const duration = options.duration ?? (type === 'error' ? 4000 : 2500)
  const toast = {
    id,
    type, // 'success' | 'error' | 'info' | 'warning'
    message: typeof message === 'string' ? message : String(message),
    duration,
  }
  toasts.push(toast)
  if (duration > 0) {
    setTimeout(() => remove(id), duration)
  }
  return id
}

export function remove(id) {
  const idx = toasts.findIndex((t) => t.id === id)
  if (idx !== -1) toasts.splice(idx, 1)
}

export const toast = {
  success(msg, opts) {
    return push('success', msg, opts)
  },
  error(msg, opts) {
    return push('error', msg, opts)
  },
  info(msg, opts) {
    return push('info', msg, opts)
  },
  warn(msg, opts) {
    return push('warning', msg, opts)
  },
  remove,
}

export default toast
