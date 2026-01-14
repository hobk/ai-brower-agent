<template>
  <header class="flex h-16 items-center justify-between px-6">
    <div class="flex items-center gap-3">
      <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
      <slot />
    </div>
    <div class="flex items-center gap-4">
      <!-- 用户信息 -->
      <div
        class="group flex items-center gap-3 rounded-full bg-white px-2 py-1.5 shadow-sm ring-1 ring-gray-100 transition-all hover:ring-blue-100"
      >
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-md shadow-blue-500/20"
        >
          {{ initials }}
        </div>
        <span class="max-w-[140px] truncate text-sm font-medium text-gray-700">{{ displayName }}</span>
        <button
          @click="logout"
          class="hidden h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 group-hover:flex transition-colors"
          aria-label="退出登录"
          title="退出登录"
        >
          <ArrowRightOnRectangleIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import api, { authToken } from '@/utils/api'
import { toast } from '@/utils/toast'
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({ title: { type: String, default: '' } })

const user = ref(null)
const tenants = ref([])
const currentTenantId = ref(null)
const currentTenantName = ref('')

onMounted(async () => {
  try {
    const raw = localStorage.getItem('auth_user')
    if (raw) {
      user.value = JSON.parse(raw)
      // 确保 currentTenantId 是字符串类型
      currentTenantId.value = user.value.currentTenantId ? String(user.value.currentTenantId) : null

      // 如果是超管，加载所有租户列表
      if (user.value?.isSuperAdmin) {
        const response = await api.get('/tenants')
        tenants.value = response?.data?.tenants || []

        // 如果没有当前租户但有租户列表，自动选择第一个
        if (!currentTenantId.value && tenants.value.length > 0) {
          currentTenantId.value = String(tenants.value[0]._id)
          // 静默切换，不刷新页面
          try {
            await api.post('/auth/switch-tenant', { tenantId: currentTenantId.value })
            // 更新本地存储的用户信息
            if (user.value) {
              user.value.currentTenantId = currentTenantId.value
              localStorage.setItem('auth_user', JSON.stringify(user.value))
            }
          } catch (e) {
            console.error('自动切换租户失败:', e)
          }
        }

        // 设置当前租户名称
        if (currentTenantId.value) {
          const currentTenant = tenants.value.find(t => String(t._id) === currentTenantId.value)
          if (currentTenant) {
            currentTenantName.value = currentTenant.name
          }
        }
      } else {
        // 普通用户：从登录响应中获取租户信息
        const tenantsData = localStorage.getItem('user_tenants')
        if (tenantsData) {
          const userTenants = JSON.parse(tenantsData)
          tenants.value = userTenants

          // 如果没有当前租户但有租户列表，自动选择第一个
          if (!currentTenantId.value && userTenants.length > 0) {
            currentTenantId.value = String(userTenants[0].tenantId)
            // 静默切换，不刷新页面
            try {
              await api.post('/auth/switch-tenant', { tenantId: currentTenantId.value })
              // 更新本地存储的用户信息
              if (user.value) {
                user.value.currentTenantId = currentTenantId.value
                localStorage.setItem('auth_user', JSON.stringify(user.value))
              }
            } catch (e) {
              console.error('自动切换租户失败:', e)
            }
          }

          if (userTenants.length > 0 && currentTenantId.value) {
            const tenant = userTenants.find(t => String(t.tenantId) === currentTenantId.value)
            if (tenant) {
              currentTenantName.value = tenant.tenantName
            }
          }
        }
      }
    }
  } catch (e) {
    console.error('加载用户信息失败:', e)
  }
})

const displayName = computed(() => user.value?.name || user.value?.email || '用户')
const initials = computed(() => {
  const name = user.value?.name || user.value?.email || 'U'
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return String(name).trim().slice(0, 1).toUpperCase()
})

// 计算是否显示租户切换器：超管或有多个租户的普通用户
const showTenantSwitcher = computed(() => {
  return user.value?.isSuperAdmin || (tenants.value && tenants.value.length > 1)
})

const router = useRouter()

const switchTenant = async () => {
  if (!currentTenantId.value) return

  try {
    await api.post('/auth/switch-tenant', { tenantId: currentTenantId.value })

    // 更新本地存储的用户信息
    if (user.value) {
      user.value.currentTenantId = currentTenantId.value
      localStorage.setItem('auth_user', JSON.stringify(user.value))
    }

    // 刷新页面以重新加载租户数据
    window.location.reload()
  } catch (e) {
    console.error('切换租户失败:', e)
    toast.error(e.response?.data?.message || '切换租户失败')
  }
}

const logout = () => {
  authToken.clear()
  localStorage.removeItem('auth_user')
  localStorage.removeItem('user_tenants')
  // 使用路由跳转，自动适配 base path
  try {
    router.push({ name: 'Login' })
  } catch (e) {
    // 兜底：仍然使用 window.location，并尽量拼接 base（如已注入）
    if (typeof window !== 'undefined') {
      const base = window.__BASE_PATH__ || '/'
      const loginPath = (base.endsWith('/') ? base : base + '/') + 'login'
      window.location.href = loginPath.replace(/\/\/+/, '/')
    }
  }
}
</script>
