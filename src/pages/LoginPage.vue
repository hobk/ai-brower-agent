<template>
  <div class="relative">
    <!-- 背景视频，左右翻转 -->
    <video
      class="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover"
      :src="bgVideo"
      autoplay
      loop
      muted
      playsinline
      preload="metadata"
      style="transform: scaleX(-1)"
    ></video>
    <!-- 微暗遮罩，提高可读性 -->
    <div class="fixed inset-0 z-10 bg-black/10"></div>

    <div class="relative z-20 flex min-h-screen">
      <!-- 左侧品牌与特性 -->
      <div class="hidden w-1/2 items-center justify-center p-12 text-white lg:flex">
        <div class="max-w-md"></div>
      </div>

      <!-- 右侧登录卡片 -->
      <div class="relative z-20 flex flex-1 items-center justify-center p-6">
        <div class="w-full max-w-md">
          <!-- 登录卡片上方的品牌（无毛玻璃、无边框背景） -->
          <!--  <div class="mb-12 flex items-center justify-center gap-3">
          <img :src="logoPng" alt="Logo" class="h-14 w-14 object-contain" />
          <div class="text-2xl md:text-4xl font-bold tracking-tight text-blue-600">
            自动化测试平台
          </div>
        </div> -->

          <div class="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
            <!-- 切换标题 -->
            <div class="mb-6">
              <div class="text-2xl font-semibold text-gray-900">
                <img :src="logoPng" alt="Logo" class="mb-1 inline h-10 w-10 object-contain" />
                {{ isRegister ? '创建新账号' : '欢迎登录' }}
              </div>
              <div class="mt-1 text-sm text-gray-500">
                {{ isRegister ? '填写信息完成注册' : '使用账号访问控制台' }}
              </div>
            </div>

            <form @submit.prevent="onSubmit" class="space-y-4">
              <div v-if="isRegister">
                <label class="mb-1 block text-sm text-gray-600">姓名</label>
                <input
                  v-model="name"
                  class="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-600">邮箱</label>
                <input
                  v-model="email"
                  type="email"
                  class="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="mb-1 block text-sm text-gray-600">密码</label>
                <input
                  v-model="password"
                  type="password"
                  class="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                :disabled="loading"
                class="w-full rounded-xl bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {{
                  loading ? (isRegister ? '注册中...' : '登录中...') : isRegister ? '注册' : '登录'
                }}
              </button>
            </form>

            <p class="mt-4 text-center text-sm text-gray-500">
              <template v-if="isRegister">
                已有账号？
                <button type="button" @click="isRegister = false" class="text-blue-600">
                  去登录
                </button>
              </template>
              <template v-else>
                没有账号？
                <button type="button" @click="isRegister = true" class="text-blue-600">
                  去注册
                </button>
              </template>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部横向介绍条 -->
    <div class="fixed inset-x-0 bottom-0 z-20">
      <div class="mx-auto max-w-7xl px-4 pb-3">
        <div class="rounded-2xl bg-black/20 ring-1 ring-white/15 backdrop-blur-md">
          <div class="grid grid-cols-1 gap-3 px-4 py-3 text-white sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="f in features" :key="f.title" class="flex items-start gap-2">
              <component :is="f.icon" class="mt-0.5 h-5 w-5 text-white/90" />
              <div>
                <div class="text-sm font-medium leading-5">{{ f.title }}</div>
                <div class="text-xs text-white/80">{{ f.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import bgVideo from '@/assets/bg.mp4'
import logoPng from '@/assets/logo.png'
import { authAPI, authToken } from '@/utils/api'
import { toast } from '@/utils/toast'
import {
  ClipboardDocumentCheckIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isRegister = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

const features = [
  { title: '用例管理', desc: '结构化管理与快速检索测试用例', icon: ClipboardDocumentCheckIcon },
  { title: '执行追踪', desc: '实时查看执行状态与历史记录', icon: PlayCircleIcon },
  { title: 'AI 辅助生成', desc: '基于自然语言快速生成用例', icon: SparklesIcon },
  { title: '权限与审计', desc: '基于角色的访问控制与操作留痕', icon: ShieldCheckIcon },
]

const onSubmit = async () => {
  loading.value = true
  try {
    let res
    if (isRegister.value) {
      res = await authAPI.register({
        name: name.value,
        email: email.value,
        password: password.value,
      })
    } else {
      res = await authAPI.login({ email: email.value, password: password.value })
    }
    const { token, user, tenants } = res.data
    authToken.set(token)
    localStorage.setItem('auth_user', JSON.stringify(user))
    // 保存用户的租户列表
    if (tenants && tenants.length > 0) {
      localStorage.setItem('user_tenants', JSON.stringify(tenants))
    }
    if (isRegister.value) {
      toast.success('注册成功，已自动登录')
    } else {
      toast.success('登录成功')
    }
    router.push('/')
  } catch (e) {
    toast.error(e.response?.data?.message || e.message)
  } finally {
    loading.value = false
  }
}
</script>
