import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 将 /@ 映射到 src 目录，便于代码中快速引用
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  server: {
    host: true,
    port: 3022,
    proxy: {
      '/autotest/api': {
        target: 'http://localhost:3011/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/autotest\/api/, '/api'),
      },
      '/autotest/reports': {
        target: 'http://localhost:3011',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/autotest\/reports/, '/reports'),
      },
      '/autotest/screenshots': {
        target: 'http://localhost:3011',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/autotest\/screenshots/, '/screenshots'),
      },
      '/autotest/uploads': {
        target: 'http://localhost:3011',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/autotest\/uploads/, '/uploads'),
      },
      '/autotest/ws': {
        target: 'http://localhost:3011',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
