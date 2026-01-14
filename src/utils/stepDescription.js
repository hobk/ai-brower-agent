import { STEP_TYPE_LABELS, STEP_TYPES } from '../constants/stepTypes'

/**
 * 生成步骤的可读描述
 * @param {Object} step - 步骤对象
 * @returns {string} 可读的步骤描述
 */
export function generateStepDescription(step) {
  if (!step) {
    return '未命名步骤'
  }

  // 如果没有 type 字段（例如来自执行记录），直接返回已保存的描述
  if (!step.type) {
    return step.stepDescription || '未命名步骤'
  }

  // 如果是引用步骤
  if (step.stepType === 'reference') {
    return step.referenceTestCaseName || '引用步骤'
  }

  const label = STEP_TYPE_LABELS[step.type] || step.type
  let detail = ''

  switch (step.type) {
    case STEP_TYPES.AI_ACTION:
      detail = step.prompt || ''
      break
    case STEP_TYPES.AI_TAP:
    case STEP_TYPES.AI_DOUBLE_CLICK:
    case STEP_TYPES.AI_RIGHT_CLICK:
    case STEP_TYPES.AI_HOVER:
      detail = step.locate || ''
      break
    case STEP_TYPES.AI_INPUT:
      if (step.inputType === 'file') {
        const fName = step.fileName || step.fileRef || '未知文件'
        detail = `上传文件 "${fName}"`
      } else {
        detail = step.text ? `"${step.text}" 到 ${step.locate || '输入框'}` : step.locate || ''
      }
      break
    case STEP_TYPES.AI_SCROLL:
      if (step.scrollParam) {
        const dir = step.scrollParam.direction || 'down'
        const dirLabels = { up: '向上', down: '向下', left: '向左', right: '向右' }
        detail = dirLabels[dir] || dir
        if (step.locate) detail += ` ${step.locate}`
      }
      break
    case STEP_TYPES.AI_KEYBOARD_PRESS:
      detail = step.key || 'Enter'
      if (step.locate) detail += ` (${step.locate})`
      break
    case STEP_TYPES.AI_ASSERT:
      detail = step.assertion || ''
      break
    case STEP_TYPES.AI_QUERY:
      detail = step.dataDemand || ''
      break
    case STEP_TYPES.AI_WAIT_FOR:
      detail = step.assertion || ''
      break
    case STEP_TYPES.NAVIGATE:
      detail = step.url || step.value || ''
      break
    case STEP_TYPES.RELOAD:
      detail = '刷新当前页面'
      break
  }

  // 兼容旧数据（如果新字段都没有，使用旧字段）
  if (!detail && step.description) {
    detail = step.description
  }

  return detail ? `${label}: ${detail}` : label
}

/**
 * 获取步骤类型的中文名称
 * @param {string} type - 步骤类型
 * @returns {string} 中文名称
 */
export function getStepTypeLabel(type) {
  return STEP_TYPE_LABELS[type] || type
}

/**
 * 检测文本中是否包含变量语法
 * @param {string} text - 要检测的文本
 * @returns {boolean} 是否包含变量
 */
export function hasVariables(text) {
  if (!text) return false
  const variablePatterns = [
    /\{\{step\d+\}\}/,
    /\{\{上一步\}\}/,
    /\{\{var:\w+\}\}/,
    /\{\{env:\w+\}\}/,
    /\{\{uuid\}\}/,
    /\{\{timestamp.*?\}\}/,
    /\{\{random:.*?\}\}/,
  ]
  return variablePatterns.some((pattern) => pattern.test(text))
}

/**
 * 获取变量系统的帮助文本
 * @returns {string} 帮助文本
 */
export function getVariableHelpText() {
  return `
变量系统使用说明：

1. 步骤结果引用：
   - {{step0}}, {{step1}}, ..., {{step9}} - 引用前面步骤的查询结果
   - {{上一步}} - 引用上一步的结果

2. 局部变量（测试用例内有效）：
   - 赋值：在 aiQuery 或 aiAction 描述中使用"到变量xxx"或"保存到变量xxx"
   - 引用：{{var:变量名}} - 如 {{var:username}}、{{var:orderId}}

3. 工具函数（自动生成数据）：
   - {{uuid}} - 生成唯一的UUID
   - {{timestamp}} - 当前时间戳（毫秒）
   - {{timestamp:YYYY-MM-DD}} - 格式化时间
   - {{random:number:1-100}} - 生成随机整数
   - {{random:string:8}} - 生成随机字符串
   - {{random:email}} - 生成随机邮箱
   - {{random:phone}} - 生成随机手机号

4. 环境变量（从租户配置读取）：
   - {{env:变量名}} - 如 {{env:USERNAME}}、{{env:PASSWORD}}

使用示例：
- 注册：text="{{random:email}}" locate="邮箱输入框"
- 登录：text="{{env:USERNAME}}" locate="用户名"
- 动态URL：url="https://example.com/orders/{{var:orderId}}"
`
}
