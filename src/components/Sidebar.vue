<template>
  <aside
    class="sticky top-0 h-screen w-64 shrink-0 border-r border-gray-100 bg-gradient-to-b from-slate-50 to-white p-4"
  >
    <div class="flex items-center gap-3 px-2 py-4">
      <img :src="logoSrc" alt="Logo" class="h-12 w-12 rounded-xl object-contain" />
      <div>
        <div class="text-sm text-gray-500">AI 驱动</div>
        <div class="text-lg font-semibold text-gray-900">自动化测试平台</div>
      </div>
    </div>

    <!-- 租户切换器 -->
    <div v-if="showTenantSwitcher" class="mx-2 mb-6">
      <div class="relative">
        <select
          v-model="currentTenantId"
          @change="switchTenant"
          class="w-full appearance-none rounded-xl border-0 bg-white px-4 py-3 pr-10 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-100 transition hover:ring-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option
            v-for="tenant in tenants"
            :key="tenant.tenantId || tenant._id"
            :value="String(tenant.tenantId || tenant._id)"
          >
            {{ tenant.tenantName || tenant.name }}
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
    <!-- 单租户显示 -->
    <div v-else-if="currentTenantName && !user?.isSuperAdmin" class="mx-2 mb-4">
      <div class="rounded-xl bg-blue-50 px-4 py-2.5 text-center">
        <div class="text-xs text-blue-600 font-medium">当前租户</div>
        <div class="text-sm font-semibold text-blue-900 mt-0.5">{{ currentTenantName }}</div>
      </div>
    </div>

    <nav class="space-y-1">
      <RouterLink :to="{ name: 'Home' }" :class="[baseItemClass, isActive('/') ? activeClass : inactiveClass]">
        <HomeIcon class="h-5 w-5 transition-colors" :class="isActive('/') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" />
        <span>首页</span>
      </RouterLink>
      
      <div class="mt-6 mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">测试用例</div>

      <RouterLink
        to="/test-cases"
        :class="[baseItemClass, isActive('/test-cases') ? activeClass : inactiveClass]"
      >
        <RectangleStackIcon class="h-5 w-5 transition-colors" :class="isActive('/test-cases') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" />
        <span>用例管理</span>
      </RouterLink>

      <RouterLink
        to="/scenarios"
        :class="[baseItemClass, isActive('/scenarios') ? activeClass : inactiveClass]"
      >
        <LinkIcon class="h-5 w-5 transition-colors" :class="isActive('/scenarios') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" />
        <span>场景编排</span>
      </RouterLink>
      
      <div class="mt-6 mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">记录分析</div>
      <RouterLink
        to="/executions"
        :class="[baseItemClass, isActive('/executions') ? activeClass : inactiveClass]"
      >
        <VideoCameraIcon class="h-5 w-5 transition-colors" :class="isActive('/executions') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" />
        <span>执行记录</span>
      </RouterLink>

      <RouterLink
        :to="{ name: 'Logs' }"
        :class="[baseItemClass, isActive('/logs') ? activeClass : inactiveClass]"
      >
        <CommandLineIcon class="h-5 w-5 transition-colors" :class="isActive('/logs') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" />
        <span>系统日志</span>
      </RouterLink>

      <!-- 系统管理 -->
      <div class="mt-6 mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">系统管理</div>
      <RouterLink
        to="/files"
        :class="[baseItemClass, isActive('/files') ? activeClass : inactiveClass]"
      >
        <FolderIcon class="h-5 w-5 transition-colors" :class="isActive('/files') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" />
        <span>文件管理</span>
      </RouterLink>
      <RouterLink
        v-if="isAdmin"
        to="/tenants"
        :class="[baseItemClass, isActive('/tenants') ? activeClass : inactiveClass]"
      >
        <BuildingOfficeIcon class="h-5 w-5 transition-colors" :class="isActive('/tenants') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" />
        <span>租户管理</span>
      </RouterLink>
      <RouterLink
        v-if="isAdmin"
        to="/users"
        :class="[baseItemClass, isActive('/users') ? activeClass : inactiveClass]"
      >
        <UserGroupIcon class="h-5 w-5 transition-colors" :class="isActive('/users') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" />
        <span>用户管理</span>
      </RouterLink>

      <RouterLink
        v-if="isAdmin"
        :to="{ name: 'SystemConfig' }"
        :class="[baseItemClass, isActive('/system-config') ? activeClass : inactiveClass]"
      >
        <Cog6ToothIcon class="h-5 w-5 transition-colors" :class="isActive('/system-config') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" />
        <span>系统配置</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import logoSrc from '@/assets/logo.png?url'
import api from '@/utils/api'
import { toast } from '@/utils/toast'
import {
  BuildingOfficeIcon,
  Cog6ToothIcon,
  FolderIcon,
  CommandLineIcon,
  HomeIcon,
  LinkIcon,
  RectangleStackIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from '@heroicons/vue/24/outline'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const user = ref(null)
const tenants = ref([])
const currentTenantId = ref(null)
const currentTenantName = ref('')

onMounted(async () => {
  try {
    const raw = localStorage.getItem('auth_user')
    if (raw) {
      user.value = JSON.parse(raw)
      currentTenantId.value = user.value.currentTenantId ? String(user.value.currentTenantId) : null

      // 如果是超管，加载所有租户列表
      if (user.value?.isSuperAdmin) {
        const response = await api.get('/tenants')
        tenants.value = response?.data?.tenants || []

        // 如果没有当前租户但有租户列表，自动选择第一个
        if (!currentTenantId.value && tenants.value.length > 0) {
          try {
            const firstTenant = tenants.value[0]
            await api.post('/auth/switch-tenant', {
              tenantId: firstTenant._id,
            })
            currentTenantId.value = String(firstTenant._id)
            currentTenantName.value = firstTenant.name
            user.value.currentTenantId = firstTenant._id
            localStorage.setItem('auth_user', JSON.stringify(user.value))
          } catch (e) {
            console.error('自动切换租户失败:', e)
          }
        }

        // 设置当前租户名称
        const currentTenant = tenants.value.find(
          (t) => String(t._id) === String(currentTenantId.value)
        )
        if (currentTenant) {
          currentTenantName.value = currentTenant.name
        }
      } else {
        // 普通用户：从登录响应中获取租户信息
        const loginData = localStorage.getItem('login_data')
        if (loginData) {
          const parsed = JSON.parse(loginData)
          tenants.value = parsed.tenants || []

          // 如果没有当前租户但有租户列表，自动选择第一个
          if (!currentTenantId.value && tenants.value.length > 0) {
            try {
              const firstTenant = tenants.value[0]
              await api.post('/auth/switch-tenant', {
                tenantId: firstTenant.tenantId,
              })
              currentTenantId.value = String(firstTenant.tenantId)
              currentTenantName.value = firstTenant.tenantName
              user.value.currentTenantId = firstTenant.tenantId
              localStorage.setItem('auth_user', JSON.stringify(user.value))
            } catch (e) {
              console.error('自动切换租户失败:', e)
            }
          }

          // 设置当前租户名称
          const currentTenant = tenants.value.find(
            (t) => String(t.tenantId) === String(currentTenantId.value)
          )
          if (currentTenant) {
            currentTenantName.value = currentTenant.tenantName
          }
        }
      }
    }
  } catch (e) {
    console.error('加载用户信息失败:', e)
  }
})

const isAdmin = computed(() => {
  return user.value?.isSuperAdmin === true
})

// 计算是否显示租户切换器：超管或有多个租户的普通用户
const showTenantSwitcher = computed(() => {
  return tenants.value.length > 1
})

// 切换租户
const switchTenant = async () => {
  try {
    const tenantId = currentTenantId.value
    await api.post('/auth/switch-tenant', { tenantId })
    // 更新本地存储
    if (user.value) {
      user.value.currentTenantId = tenantId
      localStorage.setItem('auth_user', JSON.stringify(user.value))
    }
    // 刷新页面以重新加载租户数据
    window.location.reload()
  } catch (e) {
    console.error('切换租户失败:', e)
    toast.error(e.response?.data?.message || '切换租户失败')
  }
}

const isActive = (path) => route.path === path
const baseItemClass =
  'group flex items-center gap-3 mx-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200'
const activeClass = 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-100'
const inactiveClass = 'text-gray-500 hover:bg-white/60 hover:text-gray-900'
</script>
