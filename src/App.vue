<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-white">
    <!-- 认证页（登录/注册）简洁布局：不显示头部和侧边栏 -->
    <div v-if="isAuthPage" class="min-h-screen">
      <router-view />
    </div>

    <!-- 其他页面：标准布局 -->
    <div v-else class="flex h-screen overflow-hidden">
      <Sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <TopBar :title="route.meta.title" />
        <main class="flex-1 overflow-hidden px-6">
        </main>
      </div>
    </div>
  </div>
  <!-- 全局提示容器（固定定位） -->
  <ToastContainer />
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import TopBar from '@/components/TopBar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isAuthPage = computed(
  () => route.path === '/login' || route.path === '/register' || route.path === '/playground' || route.path === '/ai-chat',
)
</script>

<style scoped></style>
