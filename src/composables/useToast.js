import toast from '../utils/toast'

export function useToast() {
  const showToast = (message, type = 'info', options = {}) => {
    switch (type) {
      case 'success':
        return toast.success(message, options)
      case 'error':
        return toast.error(message, options)
      case 'warning':
        return toast.warn(message, options)
      case 'info':
      default:
        return toast.info(message, options)
    }
  }

  return {
    showToast,
    toast,
  }
}
