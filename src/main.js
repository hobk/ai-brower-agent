import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './styles/index.css'

// 导入页面组件
import { authToken } from '@/utils/api'
import AIChatPage from './pages/AIChatPage.vue'
import HomePage from './pages/HomePage.vue'

// 路由配置
const routes = [
  {
    path: '/',
    component: HomePage,
    name: 'Home',
    redirect: '/ai-chat',
  },
  {
    path: '/ai-chat',
    component: AIChatPage,
    name: 'AIChat',
    meta: { title: 'AI 对话调试' },
  }
]

// 支持在子路径部署（例如 /autotest/）
const runtimeBase =
  typeof window !== 'undefined' && window.__BASE_PATH__ ? window.__BASE_PATH__ : undefined
const viteBase = import.meta.env.BASE_URL || undefined
const routerBase = runtimeBase || viteBase || '/'

const router = createRouter({
  history: createWebHashHistory(routerBase),
  routes,
})

// 路由守卫（简单版） - 使用命名路由跳转以兼容 base path
router.beforeEach((to, _from, next) => {
  const token = authToken.get()
  if (to.meta?.requiresAuth && !token) {
    return next({ name: 'Login' })
  }
  if (to.meta?.requiresAdmin) {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || 'null')
      // 检查是否为超级管理员
      const isSuperAdmin = user?.isSuperAdmin === true
      if (!isSuperAdmin) {
        return next({ name: 'Home' })
      }
    } catch {
      return next({ name: 'Home' })
    }
  }
  next()
})

const app = createApp(App)
app.use(router)
app.mount('#app')
