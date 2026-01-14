<template>
  <canvas ref="canvasRef" class="h-full w-full"></canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvasRef = ref(null)
let animationId = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let width = canvas.offsetWidth
  let height = canvas.offsetHeight

  // 设置 canvas 实际尺寸
  const dpr = window.devicePixelRatio || 1
  canvas.width = width * dpr
  canvas.height = height * dpr
  ctx.scale(dpr, dpr)

  const particles = []
  const particleCount = 200 // 增加粒子数量

  // 浮夸的渐变色盘
  const colors = [
    '#06b6d4', // Cyan
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#3b82f6', // Blue
    '#f43f5e', // Rose
    '#10b981', // Emerald
    '#f59e0b', // Amber
  ]

  // 初始化粒子 - 使用全屏分布而非球体
  for (let i = 0; i < particleCount; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)]
    particles.push({
      x: (Math.random() - 0.5) * width, // 初始 X 坐标 (相对于中心)
      y: (Math.random() - 0.5) * height, // 初始 Y 坐标
      z: (Math.random() - 0.5) * width, // 深度
      baseX: (Math.random() - 0.5) * width,
      baseY: (Math.random() - 0.5) * height,
      baseZ: (Math.random() - 0.5) * width,
      speed: Math.random() * 0.02 + 0.005,
      offset: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      baseColor: color,
    })
  }

  let time = 0

  const animate = () => {
    if (!canvas) return

    ctx.clearRect(0, 0, width, height)
    time += 0.01

    // 排序粒子
    particles.sort((a, b) => b.z - a.z)

    particles.forEach((p) => {
      // 复杂的流动运动轨迹
      // 结合正弦波和旋转，让粒子充满整个空间并流动

      // 绕 Y 轴旋转 (水平流动)
      const cosY = Math.cos(time * 0.5)
      const sinY = Math.sin(time * 0.5)

      // 加上波浪运动
      let x = p.baseX
      let y = p.baseY + Math.sin(time + p.offset) * 20 // 上下浮动
      let z = p.baseZ

      // 简单的 3D 旋转变换
      let x1 = x * cosY - z * sinY
      let z1 = z * cosY + x * sinY

      // 扩展 X 轴以填充宽屏幕
      x1 = x1 * 1.5

      // 透视投影
      const fov = width * 0.8
      const scale = fov / (fov + z1)

      if (scale < 0) return // 裁剪背后的点

      const px = width / 2 + x1 * scale
      const py = height / 2 + y * scale

      const alpha = Math.max(0.1, Math.min(1, (z1 + width / 2) / width))

      ctx.beginPath()
      ctx.arc(px, py, p.size * scale, 0, Math.PI * 2)

      ctx.fillStyle = p.baseColor
      ctx.globalAlpha = alpha
      ctx.fill()
      ctx.globalAlpha = 1.0
    })

    // 绘制全屏炫彩光晕背景
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.05)')
    gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.05)')
    gradient.addColorStop(1, 'rgba(236, 72, 153, 0.05)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    animationId = requestAnimationFrame(animate)
  }

  animate()
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>
