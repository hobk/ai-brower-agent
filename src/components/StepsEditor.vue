<template>
  <div class="space-y-4">
    <!-- 编辑模式切换 -->
    <div class="flex items-center justify-between">
      <div class="inline-flex rounded-lg bg-gray-100 p-1">
        <button
          @click="editMode = 'visual'"
          :class="[
            'inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
            editMode === 'visual'
              ? 'bg-white text-gray-900 shadow'
              : 'text-gray-600 hover:bg-white/50',
          ]"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          可视化
        </button>
        <button
          @click="editMode = 'json'"
          :class="[
            'inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
            editMode === 'json'
              ? 'bg-white text-gray-900 shadow'
              : 'text-gray-600 hover:bg-white/50',
          ]"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25"
            />
          </svg>
          JSON
        </button>
      </div>

      <!-- 变量帮助按钮 -->
      <button
        @click="showVariableHelper = !showVariableHelper"
        :class="[
          'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
          showVariableHelper
            ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-500'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ]"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
          />
        </svg>
        变量帮助
      </button>
    </div>

    <!-- 变量帮助面板 -->
    <div
      v-if="showVariableHelper"
      class="rounded-lg border-2 border-purple-200 bg-purple-50 p-4 shadow-sm"
    >
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-purple-900">💡 变量系统使用说明</h3>
        <button @click="showVariableHelper = false" class="text-purple-600 hover:text-purple-800">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="space-y-3">
        <!-- 工具函数 -->
        <div class="rounded-md bg-white p-3">
          <h4 class="mb-2 text-xs font-semibold text-gray-700">🔧 工具函数（自动生成数据）</h4>
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="insertVariable('{{uuid}}')"
              class="rounded bg-amber-100 px-2 py-1 text-xs text-amber-700 hover:bg-amber-200"
              title="生成唯一的UUID"
            >
              &#123;&#123;uuid&#125;&#125;
            </button>
            <button
              @click="insertVariable('{{timestamp}}')"
              class="rounded bg-amber-100 px-2 py-1 text-xs text-amber-700 hover:bg-amber-200"
              title="当前时间戳（毫秒）"
            >
              &#123;&#123;timestamp&#125;&#125;
            </button>
            <button
              @click="insertVariable('{{random:number:1-100}}')"
              class="rounded bg-amber-100 px-2 py-1 text-xs text-amber-700 hover:bg-amber-200"
              title="生成1-100之间的随机整数"
            >
              &#123;&#123;random:number:1-100&#125;&#125;
            </button>
            <button
              @click="insertVariable('{{random:string:8}}')"
              class="rounded bg-amber-100 px-2 py-1 text-xs text-amber-700 hover:bg-amber-200"
              title="生成8位随机字符串"
            >
              &#123;&#123;random:string:8&#125;&#125;
            </button>
            <button
              @click="insertVariable('{{random:email}}')"
              class="rounded bg-amber-100 px-2 py-1 text-xs text-amber-700 hover:bg-amber-200"
              title="生成随机邮箱地址"
            >
              &#123;&#123;random:email&#125;&#125;
            </button>
            <button
              @click="insertVariable('{{random:phone}}')"
              class="rounded bg-amber-100 px-2 py-1 text-xs text-amber-700 hover:bg-amber-200"
              title="生成随机手机号"
            >
              &#123;&#123;random:phone&#125;&#125;
            </button>
            <button
              @click="insertVariable('{{timestamp:YYYY-MM-DD HH:mm:ss}}')"
              class="rounded bg-amber-100 px-2 py-1 text-xs text-amber-700 hover:bg-amber-200"
              title="格式化时间"
            >
              &#123;&#123;timestamp:YYYY-MM-DD HH:mm:ss&#125;&#125;
            </button>
          </div>
          <p class="mt-1 text-xs text-gray-500">
            时间格式支持：YYYY, MM, DD, HH, mm, ss | 随机数格式：min-max
          </p>
        </div>
        <!-- 局部变量 -->
        <div class="rounded-md bg-white p-3">
          <h4 class="mb-2 text-xs font-semibold text-gray-700">📦 局部变量（测试用例内有效）</h4>
          <div class="flex flex-wrap gap-2">
            <button
              @click="insertVariable('{{var:}}')"
              class="rounded bg-green-100 px-2 py-1 text-xs text-green-700 hover:bg-green-200"
              title="引用局部变量"
            >
              &#123;&#123;var:变量名&#125;&#125;
            </button>
          </div>
          <div class="mt-2 space-y-1 text-xs text-gray-600">
            <p><strong>赋值：</strong>在 aiQuery 描述中</p>
            <p class="pl-4">
              示例，数据需求：列表中第一条数据的订单号，保存到变量：orderId，如果该变量需要在单次用例执行完成后，在后续其他场景或步骤中引用，勾选
              <b>存全局</b> 将会在该租户下持久保存
            </p>
            <p><strong>引用：</strong>使用 &#123;&#123;var:orderId&#125;&#125; 在后续步骤中使用</p>
          </div>
        </div>

        <!-- 环境变量 -->
        <div class="rounded-md bg-white p-3">
          <h4 class="mb-2 text-xs font-semibold text-gray-700">🌍 环境变量（从租户配置读取，用例中只能读取无法更改）</h4>
          <div class="flex flex-wrap gap-2">
            <button
              @click="insertVariable('{{env:}}')"
              class="rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-700 hover:bg-indigo-200"
              title="引用租户环境变量"
            >
              &#123;&#123;env:变量名&#125;&#125;
            </button>
            <button
              @click="insertVariable('{{env:USERNAME}}')"
              class="rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-700 hover:bg-indigo-200"
              title="常用：用户名"
            >
              &#123;&#123;env:USERNAME&#125;&#125;
            </button>
            <button
              @click="insertVariable('{{env:PASSWORD}}')"
              class="rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-700 hover:bg-indigo-200"
              title="常用：密码"
            >
              &#123;&#123;env:PASSWORD&#125;&#125;
            </button>
          </div>
          <p class="mt-1 text-xs text-gray-500">在系统配置-运行环境或租户管理中配置环境变量</p>
        </div>

                <!-- 步骤结果引用 -->
        <div class="rounded-md bg-white p-3">
          <h4 class="mb-2 text-xs font-semibold text-gray-700">📌 aiQuery 查询结果引用</h4>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="i in 3"
              :key="'step' + (i - 1)"
              @click="insertVariable('{{step' + (i - 1) + '}}')"
              class="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200"
              title="引用第n步的aiQuery查询结果"
            >
              &#123;&#123;step{{ i - 1 }}&#125;&#125;
            </button>
            <button
              @click="insertVariable('{{上一步}}')"
              class="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200"
              title="引用上一步的aiQuery查询结果"
            >
              &#123;&#123;上一步AI查询结果&#125;&#125;
            </button>
          </div>
          <p class="mt-1 text-xs text-gray-500">用于引用之前步骤的 aiQuery 查询结果</p>
        </div>

        <!-- 使用示例 -->
        <div class="rounded-md border border-purple-300 bg-purple-100 p-3">
          <h4 class="mb-2 text-xs font-semibold text-purple-900">✨ 使用示例</h4>
          <div class="space-y-1 text-xs text-purple-800">
            <p>• 注册时随机生成邮箱：AI输入"&#123;&#123;random:email&#125;&#125;"</p>
            <p>• 保存随机生成的邮箱：AI查询邮箱输入框中输入的邮箱，输出变量名="USERNAME"</p>
            <p>• 登录时： AI输入"&#123;&#123;var:USERNAME&#125;&#125;" </p>
            <p>• 动态URL：url="https://example.com/user/&#123;&#123;var:USERNAME&#125;&#125;"</p>
            <p>
              • 组合生成随机用户名：text="user_&#123;&#123;timestamp:MM-DD&#125;&#125;_&#123;&#123;random:string:4&#125;&#125;"
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 可视化编辑模式 -->
    <div v-if="editMode === 'visual'" class="space-y-3">
      <!-- 添加步骤按钮 -->
      <!--  <div class="flex justify-center">
        <button
          @click="addStep(steps.length)"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          <PlusIcon class="h-4 w-4" />
          添加步骤
        </button>
      </div> -->

      <!-- 步骤列表 -->
      <draggable
        v-model="steps"
        item-key="_id"
        handle=".drag-handle"
        ghost-class="ghost"
        drag-class="drag"
        @change="onStepsChanged"
        class="space-y-3"
        tag="div"
      >
        <template #item="{ element: step, index }">
          <div>
            <!-- 引用类型步骤 - 特殊展示 -->
            <div
              v-if="step.stepType === 'reference'"
              :ref="(el) => setStepRef(el, step._id)"
              class="group rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-3"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <!-- 拖拽手柄 -->
                  <div
                    class="drag-handle cursor-grab text-blue-400 hover:text-blue-600 active:cursor-grabbing"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                      />
                    </svg>
                  </div>

                  <!-- 折叠/展开按钮 -->
                  <button
                    @click="toggleReferenceExpanded(step._id)"
                    class="flex-shrink-0 rounded-md p-1 text-blue-600 hover:bg-blue-100"
                    title="展开/折叠引用步骤"
                  >
                    <svg
                      v-if="!expandedReferences[step._id]"
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <svg
                      v-else
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <!-- 序号 -->
                  <div
                    class="min-w-[2.5rem] rounded-md bg-blue-200 px-2 py-1 text-center text-xs font-semibold text-blue-800"
                  >
                    {{ index + 1 }}
                  </div>

                  <!-- 引用标签和名称 -->
                  <div class="flex items-center gap-2">
                    <span class="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                      引用
                    </span>
                    <span class="font-medium text-blue-900">
                      {{ step.referenceTestCaseName || '未知测试用例' }}
                    </span>
                    <span class="text-xs text-blue-600">
                      ({{ getReferenceStepCount(step) }} 步)
                    </span>
                  </div>
                </div>

                <!-- 操作按钮（运行/删除） -->
                <div class="flex items-center gap-1">
                  <!-- Run Button -->
                  <button
                    v-if="showRunButton"
                    @click="$emit('run-step', index)"
                    :disabled="stepStatus && stepStatus[index] === 'running'"
                    :title="
                      executionQueue.includes(index)
                        ? `排队中，前面还有 ${executionQueue.indexOf(index)} 步`
                        : stepStatus && stepStatus[index] === 'success'
                        ? '执行成功'
                        : stepStatus && stepStatus[index] === 'failed'
                        ? '执行失败'
                        : '执行此引用用例'
                    "
                    :class="[
                      'rounded-md p-1.5 disabled:opacity-50',
                      stepStatus && stepStatus[index] === 'success'
                        ? 'text-green-600 hover:bg-green-100'
                        : stepStatus && stepStatus[index] === 'failed'
                        ? 'text-red-600 hover:bg-red-100'
                        : executionQueue.includes(index)
                        ? 'text-blue-600 hover:bg-blue-100 animate-pulse'
                        : 'text-blue-600 hover:bg-blue-100',
                    ]"
                  >
                    <svg
                      v-if="stepStatus && stepStatus[index] === 'running'"
                      class="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span
                      v-else-if="executionQueue.includes(index)"
                      class="flex h-4 w-4 items-center justify-center text-xs font-bold"
                    >
                      {{ executionQueue.indexOf(index) + 1 }}
                    </span>
                    <svg
                      v-else-if="stepStatus && stepStatus[index] === 'success'"
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <svg
                      v-else-if="stepStatus && stepStatus[index] === 'failed'"
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <svg
                      v-else
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>

                  <!-- 删除按钮 -->
                  <div class="relative">
                  <button
                    @click="confirmDelete(index)"
                    title="删除此引用"
                    :class="[
                      'rounded-md p-1.5 text-red-600 transition-opacity hover:bg-red-100',
                      deleteConfirmIndex === index
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100',
                    ]"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <!-- 确认提示 -->
                  <div
                    v-if="deleteConfirmIndex === index"
                    class="absolute bottom-full right-0 z-10 mb-2 flex items-center gap-2 whitespace-nowrap rounded-lg bg-white p-2 shadow-lg ring-1 ring-black/5"
                  >
                    <span class="text-xs text-gray-600">确认删除?</span>
                    <button
                      @click="deleteStep(index)"
                      class="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      删除
                    </button>
                    <button
                      @click="cancelDelete"
                      class="text-xs text-gray-500 hover:text-gray-700"
                    >
                      取消
                    </button>
                  </div>
                  </div>
                </div>
              </div>

              <!-- 展开后显示引用的步骤(只读) -->
              <div
                v-if="expandedReferences[step._id]"
                class="mt-3 space-y-2 border-t border-blue-200 pt-3"
              >
                <template v-if="referencedStepsCache[step.referenceTestCaseId]?.length > 0">
                  <div
                    v-for="(refStep, refIndex) in referencedStepsCache[step.referenceTestCaseId]"
                    :key="refStep._id || refIndex"
                    class="flex items-center gap-2 rounded-md bg-white/60 p-2 text-sm"
                  >
                    <div
                      class="min-w-[2rem] rounded-md bg-gray-200 px-2 py-1 text-center text-xs text-gray-700"
                    >
                      {{ refIndex + 1 }}
                    </div>
                    <div class="w-28 flex-shrink-0 rounded-md bg-gray-100 px-2 py-1 text-xs">
                      {{ getStepTypeLabel(refStep.type) }}
                    </div>
                    <div class="flex-grow text-xs text-gray-700">
                      {{ generateStepDescription(refStep) }}
                    </div>
                    <span class="flex-shrink-0 text-xs text-gray-500">只读</span>
                  </div>
                </template>
                <div v-else class="text-center text-xs text-blue-600">
                  <span v-if="loadingReferences[step.referenceTestCaseId]">加载中...</span>
                  <span v-else>无法加载引用的步骤</span>
                </div>
              </div>
            </div>

            <!-- 普通步骤 -->
            <div
              v-else
              :ref="(el) => setStepRef(el, step._id)"
              :class="[
                'group flex min-h-[44px] items-center gap-2 rounded-lg p-2 transition-all duration-300',
                invalidStepId === step._id ? 'bg-red-50 ring-2 ring-red-500' : 'hover:bg-gray-100',
              ]"
            >
              <!-- 拖拽、序号 -->
              <div class="flex flex-shrink-0 items-center gap-2">
                <div
                  class="drag-handle cursor-grab text-gray-400 opacity-0 transition-opacity hover:text-gray-600 group-hover:opacity-100 active:cursor-grabbing"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                    />
                  </svg>
                </div>
                <div
                  class="min-w-[2.5rem] rounded-md bg-gray-100 px-2 py-1 text-center text-xs font-semibold text-gray-600"
                >
                  {{ index + 1 }}
                </div>
              </div>

              <!-- 类型选择 -->
              <select
                v-model="step.type"
                @change="handleTypeChange(step)"
                class="w-28 flex-shrink-0 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option :value="undefined">选择类型</option>
                <option :value="STEP_TYPES.AI_ACTION">AI 智能执行</option>
                <option :value="STEP_TYPES.AI_TAP">AI 点击</option>
                <option :value="STEP_TYPES.AI_DOUBLE_CLICK">AI 双击</option>
                <option :value="STEP_TYPES.AI_RIGHT_CLICK">AI 右键</option>
                <option :value="STEP_TYPES.AI_INPUT">AI 输入</option>
                <option :value="STEP_TYPES.AI_HOVER">AI 悬停</option>
                <option :value="STEP_TYPES.AI_SCROLL">AI 滚动</option>
                <option :value="STEP_TYPES.AI_KEYBOARD_PRESS">AI 按键</option>
                <option :value="STEP_TYPES.AI_ASSERT">AI 断言</option>
                <option :value="STEP_TYPES.AI_QUERY">AI 查询</option>
                <option :value="STEP_TYPES.AI_WAIT_FOR">AI 等待</option>
                <option :value="STEP_TYPES.NAVIGATE">导航到URL</option>
                <option :value="STEP_TYPES.RELOAD">刷新页面</option>
              </select>

              <!-- 动态输入字段 - 使用 flex-1 占据剩余空间 -->
              <div v-if="step.type" class="flex min-w-0 flex-1 items-center gap-2">
                <!-- aiAction -->
                <template v-if="step.type === STEP_TYPES.AI_ACTION">
                  <div class="relative flex-1">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >操作提示词</label
                    >
                    <input
                      v-model="step.prompt"
                      @change="onStepsChanged"
                      type="text"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="描述要执行的操作"
                    />
                  </div>
                </template>

                <!-- aiTap / aiDoubleClick / aiRightClick -->
                <template v-if="[STEP_TYPES.AI_TAP, STEP_TYPES.AI_DOUBLE_CLICK, STEP_TYPES.AI_RIGHT_CLICK].includes(step.type)">
                  <div class="relative flex-1">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >元素定位</label
                    >
                    <input
                      v-model="step.locate"
                      @change="onStepsChanged"
                      type="text"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="如: 登录按钮"
                    />
                  </div>
                </template>

                <!-- aiInput -->
                <template v-if="step.type === STEP_TYPES.AI_INPUT">
                  <div class="relative flex-1 min-w-[100px]">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >输入框定位</label
                    >
                    <input
                      v-model="step.locate"
                      @change="onStepsChanged"
                      type="text"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="如: 用户名输入框"
                    />
                  </div>
                  <!-- 输入类型选择 -->
                  <div class="relative w-20 flex-shrink-0">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >输入类型</label
                    >
                    <select
                      v-model="step.inputType"
                      @change="handleInputTypeChange(step)"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="text">文本</option>
                      <option value="file">文件</option>
                    </select>
                  </div>
                  <!-- 输入模式选择 仅文本-->
                  <div v-if="!step.inputType || step.inputType === 'text'" class="relative w-20 flex-shrink-0">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >输入模式</label
                    >
                    <select
                      v-model="step.options.mode"
                      @change="onStepsChanged"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option :value="undefined">默认</option>
                      <option value="clear">清空</option>
                      <option value="append">追加</option>
                    </select>
                  </div>
                  <!-- 文本输入 -->
                  <template v-if="(!step.inputType || step.inputType === 'text') && step.options?.mode !== 'clear'">
                    <div class="relative flex-[2] min-w-[100px]">
                      <label
                        class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        >输入内容</label
                      >
                      <input
                        v-model="step.text"
                        @change="onStepsChanged"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="要输入的文本"
                      />
                    </div>
                  </template>
                  <!-- 文件选择 -->
                  <template v-if="step.inputType === 'file'">
                    <div class="relative flex-1">
                      <label
                        class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        >选择文件</label
                      >
                      <select
                        v-model="step.fileRef"
                        @change="handleFileChange(step)"
                        class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option :value="undefined">请选择文件</option>
                        <option
                          v-for="file in availableFiles"
                          :key="file.fileId"
                          :value="file.fileId"
                        >
                          {{ file.originalName }}
                        </option>
                      </select>
                    </div>
                    <button
                      @click="refreshFileList"
                      type="button"
                      class="flex-shrink-0 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                      title="刷新文件列表"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                    <button
                      @click="openFileManagerWithUpload"
                      type="button"
                      class="flex-shrink-0 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                      title="打开文件管理并上传"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    </button>
                  </template>
                </template>

                <!-- aiHover -->
                <template v-if="step.type === STEP_TYPES.AI_HOVER">
                  <div class="relative flex-1">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >元素定位</label
                    >
                    <input
                      v-model="step.locate"
                      @change="onStepsChanged"
                      type="text"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="如: 菜单项"
                    />
                  </div>
                </template>

                <!-- aiScroll -->
                <template v-if="step.type === STEP_TYPES.AI_SCROLL">
                  <div class="relative w-22 flex-shrink-0">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >滚动方向</label
                    >
                    <select
                      v-model="step.scrollParam.direction"
                      @change="onStepsChanged"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="down">向下</option>
                      <option value="up">向上</option>
                      <option value="left">向左</option>
                      <option value="right">向右</option>
                    </select>
                  </div>
                  <div class="relative w-24 flex-shrink-0">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >滚动类型(可选)</label
                    >
                    <select
                      v-model="step.scrollParam.scrollType"
                      @change="onStepsChanged"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option :value="undefined">默认</option>
                      <option value="once">单次</option>
                      <option value="untilBottom">直到底部</option>
                      <option value="untilTop">直到顶部</option>
                    </select>
                  </div>
                  <div class="relative w-20 flex-shrink-0">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >距离(可选)</label
                    >
                    <input
                      v-model.number="step.scrollParam.distance"
                      @change="onStepsChanged"
                      type="number"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="像素"
                    />
                  </div>
                  <div class="relative flex-1 min-w-[100px]">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >滚动目标(可选)</label
                    >
                    <input
                      v-model="step.locate"
                      @change="onStepsChanged"
                      type="text"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="滚动目标(可选)"
                    />
                  </div>
                </template>

                <!-- aiKeyboardPress -->
                <template v-if="step.type === STEP_TYPES.AI_KEYBOARD_PRESS">
                  <div class="relative w-24 flex-shrink-0">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >按键</label
                    >
                    <input
                      v-model="step.key"
                      @change="onStepsChanged"
                      type="text"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="如: Enter"
                    />
                  </div>
                  <div class="relative flex-1 min-w-[100px]">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >元素定位(可选)</label
                    >
                    <input
                      v-model="step.locate"
                      @change="onStepsChanged"
                      type="text"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="元素定位(可选)"
                    />
                  </div>
                </template>

                <!-- aiAssert -->
                <template v-if="step.type === STEP_TYPES.AI_ASSERT">
                  <div class="relative flex-[2] min-w-[120px]">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >断言条件</label
                    >
                    <input
                      v-model="step.assertion"
                      @change="onStepsChanged"
                      type="text"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="断言条件"
                    />
                  </div>
                  <div class="relative flex-1 min-w-[100px]">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >错误信息(可选)</label
                    >
                    <input
                      v-model="step.errorMsg"
                      @change="onStepsChanged"
                      type="text"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="错误信息(可选)"
                    />
                  </div>
                </template>

                <!-- aiQuery -->
                <template v-if="step.type === STEP_TYPES.AI_QUERY">
                  <div class="relative flex-[2] min-w-[120px]">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >数据需求</label
                    >
                    <input
                      v-model="step.dataDemand"
                      @change="onStepsChanged"
                      type="text"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="描述要查询的数据"
                    />
                  </div>
                  <div class="relative flex-1 min-w-[100px]">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >输出变量名(可选)</label
                    >
                    <input
                      v-model="step.variableName"
                      @change="onStepsChanged"
                      type="text"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="变量名"
                    />
                  </div>
                  <div v-if="step.variableName" class="flex items-center">
                    <label
                      class="flex cursor-pointer items-center gap-1 text-sm text-gray-600"
                      title="保存到租户全局变量"
                    >
                      <input
                        type="checkbox"
                        v-model="step.saveToGlobal"
                        @change="onStepsChanged"
                        class="rounded-sm"
                      />
                      <span class="whitespace-nowrap text-xs">存全局</span>
                    </label>
                  </div>
                </template>

                <!-- aiWaitFor -->
                <template v-if="step.type === STEP_TYPES.AI_WAIT_FOR">
                  <div class="flex flex-1 gap-2">
                    <div class="relative flex-[2] min-w-[120px]">
                      <label
                        class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        >等待条件</label
                      >
                      <input
                        v-model="step.assertion"
                        @change="onStepsChanged"
                        type="text"
                        class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="等待条件 (例如: 按钮出现)"
                      />
                    </div>
                    <div class="relative flex-1 min-w-[80px]">
                      <label
                        class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        >或 固定等待(秒)</label
                      >
                      <input
                        v-model.number="step.duration"
                        @change="onStepsChanged"
                        type="number"
                        min="0"
                        class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="秒"
                      />
                    </div>
                  </div>
                </template>

                <!-- navigate -->
                <template v-if="step.type === STEP_TYPES.NAVIGATE">
                  <div class="relative flex-1">
                    <label
                      class="absolute -top-4 left-0 text-xs text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >URL地址</label
                    >
                    <input
                      v-model="step.url"
                      @change="onStepsChanged"
                      type="text"
                      class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="输入要导航的URL，如: https://example.com"
                    />
                  </div>
                </template>

                <!-- reload -->
                <template v-if="step.type === STEP_TYPES.RELOAD">
                  <div class="flex-1 text-sm text-gray-500">刷新当前页面（无需额外参数）</div>
                </template>
              </div>

              <!-- 高级选项 - 固定宽度并靠右 -->
              <div
                class="ml-auto flex flex-shrink-0 items-center gap-2 border-l border-gray-200 pl-2"
              >
                <label
                  v-if="!showRunButton"
                  class="flex cursor-pointer items-center gap-1 text-sm text-gray-600"
                  title="启用缓存"
                >
                  <input
                    type="checkbox"
                    :checked="step.options?.cacheable !== false"
                    @change="
                      (e) => {
                        if (!step.options) step.options = {}
                        step.options.cacheable = e.target.checked
                        onStepsChanged()
                      }
                    "
                    class="rounded-sm"
                  />
                  <span class="text-xs">缓存</span>
                </label>
                <label
                  class="flex cursor-pointer items-center gap-1 text-sm text-gray-600"
                  title="启用深度思考"
                >
                  <input
                    type="checkbox"
                    :checked="step.options?.deepThink"
                    @change="
                      (e) => {
                        if (!step.options) step.options = {}
                        step.options.deepThink = e.target.checked
                        onStepsChanged()
                      }
                    "
                    class="rounded-sm"
                  />
                  <span class="text-xs">深度思考</span>
                </label>
              </div>

              <!-- 操作按钮 -->
              <div class="flex flex-shrink-0 items-center gap-1">
                <!-- Run Button -->
                <button
                  v-if="showRunButton"
                  @click="$emit('run-step', index)"
                  :disabled="stepStatus && stepStatus[index] === 'running'"
                  :title="
                    executionQueue.includes(index)
                      ? `排队中，前面还有 ${executionQueue.indexOf(index)} 步`
                      : stepStatus && stepStatus[index] === 'success'
                      ? '执行成功'
                      : stepStatus && stepStatus[index] === 'failed'
                      ? '执行失败'
                      : '执行此步骤'
                  "
                  :class="[
                    'rounded-md p-1.5 disabled:opacity-50',
                    stepStatus && stepStatus[index] === 'success'
                      ? 'text-green-600 hover:bg-green-100'
                      : stepStatus && stepStatus[index] === 'failed'
                      ? 'text-red-600 hover:bg-red-100'
                      : executionQueue.includes(index)
                      ? 'text-blue-600 hover:bg-blue-100 animate-pulse'
                      : 'text-blue-600 hover:bg-blue-100',
                  ]"
                >
                  <svg
                    v-if="stepStatus && stepStatus[index] === 'running'"
                    class="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span
                    v-else-if="executionQueue.includes(index)"
                    class="flex h-4 w-4 items-center justify-center text-xs font-bold"
                  >
                    {{ executionQueue.indexOf(index) + 1 }}
                  </span>
                  <svg
                    v-else-if="stepStatus && stepStatus[index] === 'success'"
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <svg
                    v-else-if="stepStatus && stepStatus[index] === 'failed'"
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <svg
                    v-else
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>

                <button
                  @click="addStep(index + 1)"
                  title="在此后插入步骤"
                  class="rounded-md p-1.5 text-blue-600 opacity-0 transition-opacity hover:bg-blue-100 group-hover:opacity-100"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <div class="relative">
                  <button
                    @click="confirmDelete(index)"
                    title="删除此步骤"
                    :class="[
                      'rounded-md p-1.5 text-red-600 transition-opacity hover:bg-red-100',
                      deleteConfirmIndex === index
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100',
                    ]"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>

                  <!-- 确认提示 -->
                  <div
                    v-if="deleteConfirmIndex === index"
                    class="absolute bottom-full right-0 z-10 mb-2 flex items-center gap-2 whitespace-nowrap rounded-lg bg-white p-2 shadow-lg ring-1 ring-black/5"
                  >
                    <span class="text-xs text-gray-600">确认删除?</span>
                    <button
                      @click="deleteStep(index)"
                      class="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      删除
                    </button>
                    <button
                      @click="cancelDelete"
                      class="text-xs text-gray-500 hover:text-gray-700"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>

      <!-- 空状态 -->
      <div
        v-if="steps.length === 0"
        class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center"
      >
        <svg
          class="mx-auto mb-3 h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="mb-3 text-gray-600">还没有添加步骤</p>
        <button
          @click="addStep(0)"
          class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          <PlusIcon class="h-4 w-4" />
          添加第一个步骤
        </button>
      </div>
    </div>

    <!-- JSON 编辑模式 -->
    <div v-if="editMode === 'json'" class="space-y-3">
      <textarea
        v-model="jsonText"
        @blur="syncFromJson"
        class="w-full rounded-xl border border-gray-200 px-4 py-2 py-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="25"
        placeholder="输入 JSON 格式的步骤数组"
      ></textarea>
      <div v-if="jsonError" class="rounded-lg bg-red-50 p-3 text-sm text-red-600">
        ⚠️ {{ jsonError }}
      </div>
      <p class="text-xs text-gray-500">📝 编辑 JSON 将自动同步到可视化编辑器</p>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon } from '@heroicons/vue/24/outline'
import { v4 as uuidv4 } from 'uuid'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { STEP_TYPES } from '../constants/stepTypes'
import api from '../utils/api'
import { generateStepDescription, getStepTypeLabel } from '../utils/stepDescription'

const router = useRouter()

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  invalidStepId: {
    type: String,
    default: null,
  },
  allTestCases: {
    type: Array,
    default: () => [],
  },
  showRunButton: {
    type: Boolean,
    default: false,
  },
  stepStatus: {
    type: Object,
    default: () => ({}),
  },
  executionQueue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'update:invalidStepId', 'run-step'])

const isAnyStepRunning = computed(() => {
  return Object.values(props.stepStatus || {}).includes('running')
})

const editMode = ref('visual')
const steps = ref([])
const jsonText = ref('')
const jsonError = ref('')
const stepElements = ref({})
const expandedReferences = ref({}) // 记录哪些引用被展开了
const referencedStepsCache = ref({}) // 缓存引用的步骤
const loadingReferences = ref({}) // 记录正在加载的引用
const showVariableHelper = ref(false) // 显示变量帮助面板
const availableFiles = ref([]) // 可用文件列表
const deleteConfirmIndex = ref(null) // 当前正在确认删除的步骤索引

const confirmDelete = (index) => {
  if (deleteConfirmIndex.value === index) {
    deleteConfirmIndex.value = null
  } else {
    deleteConfirmIndex.value = index
  }
}

const cancelDelete = () => {
  deleteConfirmIndex.value = null
}

// 加载文件列表
const loadAvailableFiles = async () => {
  try {
    const response = await api.get('/files', { params: { pageSize: 1000 } })
    availableFiles.value = response.data.files || []
  } catch (error) {
    console.error('加载文件列表失败:', error)
  }
}

// 刷新文件列表
const refreshFileList = async () => {
  await loadAvailableFiles()
}

// 打开文件管理页面
const openFileManager = () => {
  window.open(router.resolve({ name: 'Files' }).href, '_blank')
}

// 打开文件管理页面并打开上传弹窗
const openFileManagerWithUpload = () => {
  // 使用 localStorage 传递打开上传弹窗的标记
  localStorage.setItem('openUploadDialog', 'true')
  window.open(router.resolve({ name: 'Files' }).href, '_blank')
}

// 处理输入类型变化
const handleInputTypeChange = (step) => {
  if (step.inputType === 'text') {
    // 切换到文本输入，清空文件引用
    step.fileRef = undefined
    step.fileName = undefined
  } else if (step.inputType === 'file') {
    // 切换到文件上传，清空文本内容
    step.text = ''
  }
  onStepsChanged()
}

// 处理文件选择变化
const handleFileChange = (step) => {
  const file = availableFiles.value.find((f) => f.fileId === step.fileRef)
  if (file) {
    step.fileName = file.originalName
  } else {
    step.fileName = undefined
  }
  onStepsChanged()
}

// 监听页面可见性变化，自动刷新文件列表
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    loadAvailableFiles()
  }
}

// 组件挂载时加载文件列表
onMounted(() => {
  loadAvailableFiles()
  // 监听页面可见性变化
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

// 组件卸载时移除监听器
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

// 插入变量到当前焦点的输入框
const insertVariable = (variableTemplate) => {
  const activeElement = document.activeElement
  if (activeElement && activeElement.tagName === 'INPUT' && activeElement.type === 'text') {
    const start = activeElement.selectionStart || 0
    const end = activeElement.selectionEnd || 0
    const text = activeElement.value || ''
    const newText = text.substring(0, start) + variableTemplate + text.substring(end)

    // 更新输入框的值
    activeElement.value = newText

    // 触发输入事件以更新 v-model
    activeElement.dispatchEvent(new Event('input', { bubbles: true }))

    // 设置光标位置（在插入的变量后面）
    const newCursorPos = start + variableTemplate.length
    activeElement.focus()
    activeElement.setSelectionRange(newCursorPos, newCursorPos)
  } else {
    // 如果没有焦点输入框，复制到剪贴板
    navigator.clipboard.writeText(variableTemplate).then(() => {
      console.log('变量已复制到剪贴板:', variableTemplate)
    })
  }
}

const setStepRef = (el, id) => {
  if (el) {
    stepElements.value[id] = el
  }
}

watch(
  () => props.invalidStepId,
  (newId) => {
    if (newId && stepElements.value[newId]) {
      stepElements.value[newId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }
)

// 同步到 JSON 文本
const syncToJson = () => {
  jsonText.value = JSON.stringify(steps.value, null, 2)
  jsonError.value = ''
}

// 初始化步骤
watch(
  () => props.modelValue,
  (newVal) => {
    if (Array.isArray(newVal)) {
      steps.value = newVal.map((step) => {
        const normalizedStep = {
          ...step,
          _id: step._id || uuidv4(),
        }

        // 兼容旧数据迁移
        // 1. aiScroll: 从 value 迁移到 scrollParam
        if (normalizedStep.type === STEP_TYPES.AI_SCROLL && !normalizedStep.scrollParam) {
          normalizedStep.scrollParam = {
            direction: normalizedStep.value || 'down',
            scrollType: undefined,
            distance: undefined,
          }
        }

        // 2. aiInput: 从 value 迁移到 text，初始化 inputType
        if (normalizedStep.type === STEP_TYPES.AI_INPUT) {
          if (!normalizedStep.text && normalizedStep.value) {
            normalizedStep.text = normalizedStep.value
          }
          // 初始化 inputType：如果有 fileRef 则为 file，否则为 text
          if (!normalizedStep.inputType) {
            normalizedStep.inputType = normalizedStep.fileRef ? 'file' : 'text'
          }
        }

        // 3. aiKeyboardPress: 从 value 迁移到 key
        if (
          normalizedStep.type === STEP_TYPES.AI_KEYBOARD_PRESS &&
          !normalizedStep.key &&
          normalizedStep.value
        ) {
          normalizedStep.key = normalizedStep.value
        }

        // 4. aiAssert/aiWaitFor: 从 expectedResult 迁移到 assertion
        if (
          (normalizedStep.type === STEP_TYPES.AI_ASSERT || normalizedStep.type === STEP_TYPES.AI_WAIT_FOR) &&
          !normalizedStep.assertion &&
          normalizedStep.expectedResult
        ) {
          normalizedStep.assertion = normalizedStep.expectedResult
        }

        // 5. aiQuery: 从 description 迁移到 dataDemand
        if (
          normalizedStep.type === STEP_TYPES.AI_QUERY &&
          !normalizedStep.dataDemand &&
          normalizedStep.description
        ) {
          normalizedStep.dataDemand = normalizedStep.description
        }

        // 6. aiAction: 从 description/locate 迁移到 prompt
        if (normalizedStep.type === STEP_TYPES.AI_ACTION && !normalizedStep.prompt) {
          normalizedStep.prompt = normalizedStep.description || normalizedStep.locate || ''
        }

        // 确保 options 存在
        if (!normalizedStep.options) {
          normalizedStep.options = {}
        }

        return normalizedStep
      })
      syncToJson()
    }
  },
  { immediate: true, deep: true }
)

// 从 JSON 文本同步
const syncFromJson = () => {
  try {
    jsonError.value = ''
    if (!jsonText.value.trim()) {
      steps.value = []
      return
    }
    const parsed = JSON.parse(jsonText.value)
    if (!Array.isArray(parsed)) {
      jsonError.value = '必须是数组格式'
      return
    }
    steps.value = parsed.map((step) => {
      const normalizedStep = {
        ...step,
        _id: step._id || uuidv4(),
      }

      // 兼容旧数据迁移（同上）
      if (normalizedStep.type === STEP_TYPES.AI_SCROLL && !normalizedStep.scrollParam) {
        normalizedStep.scrollParam = {
          direction: normalizedStep.value || 'down',
          scrollType: undefined,
          distance: undefined,
        }
      }
      if (normalizedStep.type === STEP_TYPES.AI_INPUT) {
        if (!normalizedStep.text && normalizedStep.value) {
          normalizedStep.text = normalizedStep.value
        }
        if (!normalizedStep.inputType) {
          normalizedStep.inputType = normalizedStep.fileRef ? 'file' : 'text'
        }
      }
      if (
        normalizedStep.type === STEP_TYPES.AI_KEYBOARD_PRESS &&
        !normalizedStep.key &&
        normalizedStep.value
      ) {
        normalizedStep.key = normalizedStep.value
      }
      if (
        (normalizedStep.type === STEP_TYPES.AI_ASSERT || normalizedStep.type === STEP_TYPES.AI_WAIT_FOR) &&
        !normalizedStep.assertion &&
        normalizedStep.expectedResult
      ) {
        normalizedStep.assertion = normalizedStep.expectedResult
      }
      if (
        normalizedStep.type === STEP_TYPES.AI_QUERY &&
        !normalizedStep.dataDemand &&
        normalizedStep.description
      ) {
        normalizedStep.dataDemand = normalizedStep.description
      }
      if (normalizedStep.type === STEP_TYPES.AI_ACTION && !normalizedStep.prompt) {
        normalizedStep.prompt = normalizedStep.description || normalizedStep.locate || ''
      }

      // 确保 options 存在
      if (!normalizedStep.options) {
        normalizedStep.options = {}
      }

      return normalizedStep
    })
    emit('update:modelValue', steps.value)
  } catch (e) {
    jsonError.value = `JSON 解析错误: ${e.message}`
  }
}

// 步骤变化时触发更新
const onStepsChanged = () => {
  if (props.invalidStepId) {
    emit('update:invalidStepId', null)
  }
  syncToJson()
  emit('update:modelValue', steps.value)
}

// 处理类型变更，初始化特定类型所需的字段
const handleTypeChange = (step) => {
  // 如果切换到 aiScroll，确保 scrollParam 对象存在
  if (step.type === STEP_TYPES.AI_SCROLL && !step.scrollParam) {
    step.scrollParam = {
      direction: 'down',
      scrollType: undefined,
      distance: undefined,
    }
  }
  onStepsChanged()
}

// 添加步骤
const addStep = (index) => {
  const newStep = {
    _id: uuidv4(),
    type: undefined,
    // 新字段初始化为空字符串
    prompt: '',
    locate: '',
    text: '',
    key: '',
    assertion: '',
    errorMsg: '',
    dataDemand: '',
    scrollParam: undefined,
    options: {},
    inputType: 'text', // 默认为文本输入
  }
  steps.value.splice(index, 0, newStep)
  onStepsChanged()
}

// 删除步骤
const deleteStep = (index) => {
  steps.value.splice(index, 1)
  deleteConfirmIndex.value = null
  onStepsChanged()
}

// 切换引用步骤的展开/折叠
const toggleReferenceExpanded = async (stepId) => {
  const step = steps.value.find((s) => s._id === stepId)
  if (!step || step.stepType !== 'reference') return

  expandedReferences.value[stepId] = !expandedReferences.value[stepId]

  // 如果展开且还没有缓存，则加载引用的步骤
  if (expandedReferences.value[stepId] && !referencedStepsCache.value[step.referenceTestCaseId]) {
    await loadReferencedSteps(step.referenceTestCaseId)
  }
}

// 加载引用测试用例的步骤
const loadReferencedSteps = async (testCaseId) => {
  if (!testCaseId || loadingReferences.value[testCaseId]) return

  loadingReferences.value[testCaseId] = true

  try {
    // 从 allTestCases 中查找
    const testCase = props.allTestCases.find((tc) => tc._id === testCaseId)
    if (testCase && testCase.steps) {
      referencedStepsCache.value[testCaseId] = testCase.steps
    } else {
      // 如果 allTestCases 中没有，则从 API 加载
      const { testCaseAPI } = await import('@/utils/api')
      const res = await testCaseAPI.get(testCaseId)
      referencedStepsCache.value[testCaseId] = res.data.steps || []
    }
  } catch (error) {
    console.error('加载引用步骤失败:', error)
    referencedStepsCache.value[testCaseId] = []
  } finally {
    loadingReferences.value[testCaseId] = false
  }
}

// 获取引用步骤的数量
const getReferenceStepCount = (step) => {
  if (!step.referenceTestCaseId) return 0

  // 先从缓存中查找
  if (referencedStepsCache.value[step.referenceTestCaseId]) {
    return referencedStepsCache.value[step.referenceTestCaseId].length
  }

  // 从 allTestCases 中查找
  const testCase = props.allTestCases.find((tc) => tc._id === step.referenceTestCaseId)
  return testCase?.steps?.length || 0
}
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #f0f0f0;
}

.drag {
  opacity: 1;
  background: #fff;
}
</style>
