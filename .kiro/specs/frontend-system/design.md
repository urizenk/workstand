# 前端系统设计文档

## 概述

个人工作台前端系统是一个基于Vue 3的现代化Web应用，采用模块化架构设计，为AI开发、爬虫管理、新媒体运营等多个业务模块提供统一的用户界面。

## 技术架构

### 技术栈
- **框架**: Vue 3.3+ (Composition API)
- **语言**: TypeScript 5.0+
- **构建工具**: Vite 4.0+
- **UI框架**: Element Plus 2.3+
- **状态管理**: Pinia 2.0+
- **路由**: Vue Router 4.2+
- **HTTP客户端**: Axios 1.4+
- **实时通信**: Socket.io-client
- **图标**: @element-plus/icons-vue
- **样式**: SCSS + CSS Variables
- **代码规范**: ESLint + Prettier

### 项目结构
```
src/
├── assets/                     # 静态资源
│   ├── images/                # 图片资源
│   ├── icons/                 # 图标资源
│   └── styles/                # 全局样式
│       ├── variables.scss     # SCSS变量
│       ├── mixins.scss        # SCSS混入
│       └── global.scss        # 全局样式
├── components/                 # 通用组件
│   ├── common/                # 基础通用组件
│   │   ├── AppHeader.vue      # 应用头部
│   │   ├── AppSidebar.vue     # 侧边栏
│   │   ├── AppBreadcrumb.vue  # 面包屑
│   │   ├── LoadingSpinner.vue # 加载动画
│   │   ├── EmptyState.vue     # 空状态
│   │   └── ErrorBoundary.vue  # 错误边界
│   ├── form/                  # 表单组件
│   │   ├── JsonEditor.vue     # JSON编辑器
│   │   ├── CodeEditor.vue     # 代码编辑器
│   │   ├── FileUpload.vue     # 文件上传
│   │   └── TagInput.vue       # 标签输入
│   ├── data/                  # 数据展示组件
│   │   ├── DataTable.vue      # 数据表格
│   │   ├── StatCard.vue       # 统计卡片
│   │   ├── ChartContainer.vue # 图表容器
│   │   └── TreeView.vue       # 树形视图
│   └── business/              # 业务组件
│       ├── ProjectSelector.vue # 项目选择器
│       ├── ModelSelector.vue   # AI模型选择器
│       ├── PlatformBadge.vue  # 平台标识
│       └── StatusIndicator.vue # 状态指示器
├── views/                     # 页面组件
│   ├── layout/                # 布局组件
│   │   ├── DefaultLayout.vue  # 默认布局
│   │   ├── FullscreenLayout.vue # 全屏布局
│   │   └── SimpleLayout.vue   # 简单布局
│   ├── home/                  # 首页
│   │   └── Dashboard.vue      # 仪表板
│   ├── ai-development/        # AI开发模块
│   │   ├── Dashboard.vue      # AI开发仪表板
│   │   ├── Projects.vue       # 项目管理
│   │   ├── ApiTokens.vue      # API Token管理
│   │   ├── Prompts.vue        # 提示词管理
│   │   ├── McpServers.vue     # MCP服务管理
│   │   ├── Agents.vue         # 智能体管理
│   │   └── Workflows.vue      # 工作流管理
│   ├── spider/                # 爬虫管理
│   │   ├── Tasks.vue          # 爬虫任务
│   │   ├── Rules.vue          # 爬取规则
│   │   ├── Data.vue           # 爬取数据
│   │   └── Settings.vue       # 爬虫设置
│   ├── media/                 # 新媒体运营
│   │   ├── Content.vue        # 内容管理
│   │   ├── Publish.vue        # 发布管理
│   │   ├── Analytics.vue      # 数据分析
│   │   └── Assets.vue         # 素材库
│   ├── content/               # 内容管理
│   │   ├── Bookmarks.vue      # 书签管理
│   │   ├── News.vue           # 新闻聚合
│   │   └── Reading.vue        # 阅读管理
│   ├── accounts/              # 账号管理
│   │   ├── Virtual.vue        # 虚拟账号
│   │   ├── Platforms.vue      # 平台账号
│   │   └── Proxies.vue        # 代理管理
│   └── system/                # 系统管理
│       ├── Settings.vue       # 系统设置
│       ├── Logs.vue           # 系统日志
│       └── About.vue          # 关于页面
├── stores/                    # Pinia状态管理
│   ├── index.ts              # Store入口
│   ├── app.ts                # 应用状态
│   ├── user.ts               # 用户状态
│   ├── ai.ts                 # AI开发状态
│   ├── spider.ts             # 爬虫状态
│   ├── media.ts              # 新媒体状态
│   ├── content.ts            # 内容状态
│   └── accounts.ts           # 账号状态
├── composables/              # 组合式函数
│   ├── useApi.ts             # API调用
│   ├── useWebSocket.ts       # WebSocket连接
│   ├── useNotification.ts    # 通知管理
│   ├── usePermission.ts      # 权限管理
│   ├── useTheme.ts           # 主题管理
│   └── useLocalStorage.ts    # 本地存储
├── services/                 # 服务层
│   ├── api/                  # API服务
│   │   ├── index.ts          # API客户端
│   │   ├── ai.ts             # AI相关API
│   │   ├── spider.ts         # 爬虫API
│   │   ├── media.ts          # 新媒体API
│   │   ├── content.ts        # 内容API
│   │   └── accounts.ts       # 账号API
│   ├── websocket.ts          # WebSocket服务
│   ├── storage.ts            # 存储服务
│   └── utils.ts              # 工具函数
├── router/                   # 路由配置
│   ├── index.ts              # 路由入口
│   ├── modules/              # 模块路由
│   │   ├── ai.ts             # AI开发路由
│   │   ├── spider.ts         # 爬虫路由
│   │   ├── media.ts          # 新媒体路由
│   │   └── content.ts        # 内容路由
│   └── guards.ts             # 路由守卫
├── types/                    # TypeScript类型定义
│   ├── api.ts                # API类型
│   ├── common.ts             # 通用类型
│   ├── ai.ts                 # AI相关类型
│   ├── spider.ts             # 爬虫类型
│   ├── media.ts              # 新媒体类型
│   └── content.ts            # 内容类型
├── utils/                    # 工具函数
│   ├── format.ts             # 格式化工具
│   ├── validate.ts           # 验证工具
│   ├── date.ts               # 日期工具
│   └── file.ts               # 文件工具
├── App.vue                   # 根组件
└── main.ts                   # 应用入口
```

## 核心设计理念

### 1. 模块化设计
- **功能模块独立**: 每个业务模块独立开发和维护
- **组件复用**: 通用组件在多个模块间复用
- **状态隔离**: 各模块状态独立管理，避免耦合

### 2. 响应式设计
- **移动端适配**: 支持手机、平板等移动设备
- **弹性布局**: 使用Flexbox和Grid布局
- **断点设计**: 定义多个响应式断点

### 3. 用户体验
- **加载状态**: 所有异步操作提供加载反馈
- **错误处理**: 友好的错误提示和恢复机制
- **操作反馈**: 及时的操作成功/失败反馈

## 状态管理设计

### Pinia Store架构
```typescript
// stores/app.ts - 应用全局状态
export const useAppStore = defineStore('app', {
  state: () => ({
    theme: 'light' as 'light' | 'dark',
    sidebarCollapsed: false,
    loading: false,
    notifications: [] as Notification[],
    currentProject: null as Project | null
  }),
  
  getters: {
    isDarkMode: (state) => state.theme === 'dark',
    hasNotifications: (state) => state.notifications.length > 0
  },
  
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
    
    setLoading(loading: boolean) {
      this.loading = loading
    },
    
    addNotification(notification: Notification) {
      this.notifications.push(notification)
    }
  }
})

// stores/ai.ts - AI开发状态
export const useAIStore = defineStore('ai', {
  state: () => ({
    projects: [] as Project[],
    apiTokens: [] as ApiToken[],
    prompts: [] as Prompt[],
    mcpServers: [] as McpServer[],
    agents: [] as Agent[],
    workflows: [] as Workflow[],
    currentProject: null as Project | null
  }),
  
  actions: {
    async fetchProjects() {
      const { data } = await aiApi.getProjects()
      this.projects = data
    },
    
    async createProject(project: CreateProjectDto) {
      const { data } = await aiApi.createProject(project)
      this.projects.push(data)
      return data
    }
  }
})
```

## 组件设计规范

### 1. 组件命名规范
- **PascalCase**: 组件文件名使用PascalCase
- **语义化**: 组件名称要能清晰表达功能
- **前缀**: 业务组件使用模块前缀，如`AiProjectCard`

### 2. 组件结构规范
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 导入
import { ref, computed, onMounted } from 'vue'
import type { ComponentProps } from '@/types'

// 接口定义
interface Props {
  title: string
  data?: any[]
}

interface Emits {
  (e: 'update', value: any): void
  (e: 'delete', id: string): void
}

// Props和Emits
const props = withDefaults(defineProps<Props>(), {
  data: () => []
})

const emit = defineEmits<Emits>()

// 响应式数据
const loading = ref(false)
const selectedItems = ref<string[]>([])

// 计算属性
const hasData = computed(() => props.data.length > 0)

// 方法
const handleUpdate = (value: any) => {
  emit('update', value)
}

// 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped lang="scss">
// 样式内容
</style>
```

### 3. 通用组件设计

#### DataTable组件
```vue
<template>
  <div class="data-table">
    <div class="table-header" v-if="showHeader">
      <div class="table-title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="table-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <el-table
      :data="data"
      :loading="loading"
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="selectable"
        type="selection"
        width="55"
      />
      
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        v-bind="column"
      >
        <template #default="{ row, column, $index }">
          <slot
            :name="column.property"
            :row="row"
            :column="column"
            :index="$index"
          >
            {{ row[column.property] }}
          </slot>
        </template>
      </el-table-column>
      
      <el-table-column
        v-if="showActions"
        label="操作"
        width="200"
        fixed="right"
      >
        <template #default="{ row, $index }">
          <slot name="actions" :row="row" :index="$index">
            <el-button size="small" @click="$emit('edit', row)">
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="$emit('delete', row)"
            >
              删除
            </el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="table-footer" v-if="showPagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  prop: string
  label: string
  width?: number
  minWidth?: number
  fixed?: boolean | string
  sortable?: boolean
  formatter?: (row: any, column: any, cellValue: any) => string
}

interface Props {
  data: any[]
  columns: Column[]
  loading?: boolean
  title?: string
  showHeader?: boolean
  showActions?: boolean
  showPagination?: boolean
  selectable?: boolean
  total?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showHeader: true,
  showActions: true,
  showPagination: true,
  selectable: false,
  total: 0
})

const emit = defineEmits<{
  edit: [row: any]
  delete: [row: any]
  selectionChange: [selection: any[]]
  pageChange: [page: number, size: number]
}>()

const currentPage = ref(1)
const pageSize = ref(20)

const handleSelectionChange = (selection: any[]) => {
  emit('selectionChange', selection)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  emit('pageChange', currentPage.value, size)
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  emit('pageChange', page, pageSize.value)
}
</script>
```

## 路由设计

### 路由结构
```typescript
// router/index.ts
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/home/Dashboard.vue'),
        meta: {
          title: '仪表板',
          icon: 'House',
          keepAlive: true
        }
      }
    ]
  },
  
  // AI开发模块
  {
    path: '/ai',
    component: DefaultLayout,
    meta: {
      title: 'AI开发',
      icon: 'Cpu'
    },
    children: [
      {
        path: 'dashboard',
        name: 'AIDashboard',
        component: () => import('@/views/ai-development/Dashboard.vue'),
        meta: { title: 'AI仪表板' }
      },
      {
        path: 'projects',
        name: 'AIProjects',
        component: () => import('@/views/ai-development/Projects.vue'),
        meta: { title: '项目管理' }
      },
      {
        path: 'tokens',
        name: 'APITokens',
        component: () => import('@/views/ai-development/ApiTokens.vue'),
        meta: { title: 'API Token' }
      },
      {
        path: 'prompts',
        name: 'Prompts',
        component: () => import('@/views/ai-development/Prompts.vue'),
        meta: { title: '提示词管理' }
      },
      {
        path: 'mcp',
        name: 'McpServers',
        component: () => import('@/views/ai-development/McpServers.vue'),
        meta: { title: 'MCP管理' }
      },
      {
        path: 'agents',
        name: 'Agents',
        component: () => import('@/views/ai-development/Agents.vue'),
        meta: { title: '智能体管理' }
      },
      {
        path: 'workflows',
        name: 'Workflows',
        component: () => import('@/views/ai-development/Workflows.vue'),
        meta: { title: '工作流管理' }
      }
    ]
  },
  
  // 其他模块路由...
]
```

### 路由守卫
```typescript
// router/guards.ts
export function setupRouterGuards(router: Router) {
  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore()
    
    // 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - 个人工作台`
    }
    
    // 显示加载状态
    appStore.setLoading(true)
    
    next()
  })
  
  // 全局后置守卫
  router.afterEach(() => {
    const appStore = useAppStore()
    appStore.setLoading(false)
  })
}
```

## API服务设计

### HTTP客户端配置
```typescript
// services/api/index.ts
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class ApiClient {
  private instance: AxiosInstance
  
  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    this.setupInterceptors()
  }
  
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
    
    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error
        
        if (response?.status === 401) {
          // 处理未授权
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        
        return Promise.reject(error)
      }
    )
  }
  
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get(url, config)
    return response.data
  }
  
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post(url, data, config)
    return response.data
  }
  
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put(url, data, config)
    return response.data
  }
  
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL)
```

### 模块化API服务
```typescript
// services/api/ai.ts
export const aiApi = {
  // 项目管理
  getProjects: () => apiClient.get<Project[]>('/api/ai/projects'),
  createProject: (data: CreateProjectDto) => apiClient.post<Project>('/api/ai/projects', data),
  updateProject: (id: string, data: UpdateProjectDto) => apiClient.put<Project>(`/api/ai/projects/${id}`, data),
  deleteProject: (id: string) => apiClient.delete(`/api/ai/projects/${id}`),
  
  // API Token管理
  getTokens: () => apiClient.get<ApiToken[]>('/api/ai/tokens'),
  createToken: (data: CreateTokenDto) => apiClient.post<ApiToken>('/api/ai/tokens', data),
  updateToken: (id: string, data: UpdateTokenDto) => apiClient.put<ApiToken>(`/api/ai/tokens/${id}`, data),
  deleteToken: (id: string) => apiClient.delete(`/api/ai/tokens/${id}`),
  testToken: (id: string) => apiClient.post<{ valid: boolean }>(`/api/ai/tokens/${id}/test`),
  
  // 提示词管理
  getPrompts: (params?: PromptQueryParams) => apiClient.get<Prompt[]>('/api/ai/prompts', { params }),
  createPrompt: (data: CreatePromptDto) => apiClient.post<Prompt>('/api/ai/prompts', data),
  updatePrompt: (id: string, data: UpdatePromptDto) => apiClient.put<Prompt>(`/api/ai/prompts/${id}`, data),
  deletePrompt: (id: string) => apiClient.delete(`/api/ai/prompts/${id}`),
  
  // MCP服务管理
  getMcpServers: () => apiClient.get<McpServer[]>('/api/ai/mcp/servers'),
  createMcpServer: (data: CreateMcpServerDto) => apiClient.post<McpServer>('/api/ai/mcp/servers', data),
  updateMcpServer: (id: string, data: UpdateMcpServerDto) => apiClient.put<McpServer>(`/api/ai/mcp/servers/${id}`, data),
  deleteMcpServer: (id: string) => apiClient.delete(`/api/ai/mcp/servers/${id}`),
  startMcpServer: (id: string) => apiClient.post(`/api/ai/mcp/servers/${id}/start`),
  stopMcpServer: (id: string) => apiClient.post(`/api/ai/mcp/servers/${id}/stop`),
  
  // 智能体管理
  getAgents: () => apiClient.get<Agent[]>('/api/ai/agents'),
  createAgent: (data: CreateAgentDto) => apiClient.post<Agent>('/api/ai/agents', data),
  updateAgent: (id: string, data: UpdateAgentDto) => apiClient.put<Agent>(`/api/ai/agents/${id}`, data),
  deleteAgent: (id: string) => apiClient.delete(`/api/ai/agents/${id}`),
  executeAgent: (id: string, input: any) => apiClient.post(`/api/ai/agents/${id}/execute`, { input }),
  
  // 工作流管理
  getWorkflows: () => apiClient.get<Workflow[]>('/api/ai/workflows'),
  createWorkflow: (data: CreateWorkflowDto) => apiClient.post<Workflow>('/api/ai/workflows', data),
  updateWorkflow: (id: string, data: UpdateWorkflowDto) => apiClient.put<Workflow>(`/api/ai/workflows/${id}`, data),
  deleteWorkflow: (id: string) => apiClient.delete(`/api/ai/workflows/${id}`),
  executeWorkflow: (id: string, input?: any) => apiClient.post(`/api/ai/workflows/${id}/execute`, { input }),
  getWorkflowStatus: (id: string) => apiClient.get<WorkflowStatus>(`/api/ai/workflows/${id}/status`)
}
```

## WebSocket集成

### WebSocket服务
```typescript
// services/websocket.ts
import { io, Socket } from 'socket.io-client'

class WebSocketService {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  
  connect(url: string) {
    this.socket = io(url, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000
    })
    
    this.setupEventHandlers()
  }
  
  private setupEventHandlers() {
    if (!this.socket) return
    
    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    })
    
    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })
    
    this.socket.on('reconnect', () => {
      console.log('WebSocket reconnected')
    })
    
    this.socket.on('reconnect_error', () => {
      this.reconnectAttempts++
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('WebSocket reconnection failed')
      }
    })
  }
  
  subscribe(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }
  
  unsubscribe(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback)
      } else {
        this.socket.off(event)
      }
    }
  }
  
  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export const wsService = new WebSocketService()
```

### WebSocket Composable
```typescript
// composables/useWebSocket.ts
export function useWebSocket() {
  const isConnected = ref(false)
  
  const connect = (url: string) => {
    wsService.connect(url)
    
    wsService.subscribe('connect', () => {
      isConnected.value = true
    })
    
    wsService.subscribe('disconnect', () => {
      isConnected.value = false
    })
  }
  
  const subscribe = (event: string, callback: (data: any) => void) => {
    wsService.subscribe(event, callback)
  }
  
  const unsubscribe = (event: string, callback?: (data: any) => void) => {
    wsService.unsubscribe(event, callback)
  }
  
  const emit = (event: string, data?: any) => {
    wsService.emit(event, data)
  }
  
  onUnmounted(() => {
    wsService.disconnect()
  })
  
  return {
    isConnected: readonly(isConnected),
    connect,
    subscribe,
    unsubscribe,
    emit
  }
}
```

## 主题系统

### CSS变量定义
```scss
// assets/styles/variables.scss
:root {
  // 主色调
  --color-primary: #409eff;
  --color-primary-light: #79bbff;
  --color-primary-dark: #337ecc;
  
  // 功能色
  --color-success: #67c23a;
  --color-warning: #e6a23c;
  --color-danger: #f56c6c;
  --color-info: #909399;
  
  // 中性色
  --color-text-primary: #303133;
  --color-text-regular: #606266;
  --color-text-secondary: #909399;
  --color-text-placeholder: #c0c4cc;
  
  // 背景色
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f7fa;
  --color-bg-tertiary: #fafafa;
  
  // 边框色
  --color-border-light: #ebeef5;
  --color-border-base: #dcdfe6;
  --color-border-dark: #d4d7de;
  
  // 阴影
  --shadow-light: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  --shadow-base: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.12);
  --shadow-dark: 0 4px 8px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.12);
  
  // 间距
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  // 圆角
  --border-radius-sm: 2px;
  --border-radius-base: 4px;
  --border-radius-lg: 6px;
  --border-radius-xl: 8px;
}

// 暗色主题
[data-theme='dark'] {
  --color-text-primary: #e4e7ed;
  --color-text-regular: #cfcfcf;
  --color-text-secondary: #a8abb2;
  --color-text-placeholder: #6c6e72;
  
  --color-bg-primary: #141414;
  --color-bg-secondary: #1d1e1f;
  --color-bg-tertiary: #262727;
  
  --color-border-light: #414243;
  --color-border-base: #4c4d4f;
  --color-border-dark: #58585b;
}
```

### 主题切换Composable
```typescript
// composables/useTheme.ts
export function useTheme() {
  const theme = ref<'light' | 'dark'>('light')
  
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(theme.value)
  }
  
  const applyTheme = (newTheme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }
  
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    
    theme.value = savedTheme || systemTheme
    applyTheme(theme.value)
  }
  
  onMounted(() => {
    initTheme()
  })
  
  return {
    theme: readonly(theme),
    toggleTheme,
    applyTheme
  }
}
```

## 性能优化

### 1. 代码分割
```typescript
// 路由懒加载
const routes = [
  {
    path: '/ai',
    component: () => import('@/views/ai-development/Dashboard.vue')
  }
]

// 组件懒加载
const LazyComponent = defineAsyncComponent(() => import('@/components/HeavyComponent.vue'))
```

### 2. 虚拟滚动
```vue
<!-- 大列表优化 -->
<template>
  <el-virtual-list
    :data="largeDataList"
    :height="400"
    :item-size="50"
  >
    <template #default="{ item, index }">
      <div class="list-item">{{ item.name }}</div>
    </template>
  </el-virtual-list>
</template>
```

### 3. 缓存策略
```typescript
// 组件缓存
<router-view v-slot="{ Component }">
  <keep-alive :include="cachedComponents">
    <component :is="Component" />
  </keep-alive>
</router-view>

// API缓存
const cache = new Map()

export function useCachedApi<T>(key: string, fetcher: () => Promise<T>) {
  const data = ref<T>()
  const loading = ref(false)
  
  const fetch = async () => {
    if (cache.has(key)) {
      data.value = cache.get(key)
      return
    }
    
    loading.value = true
    try {
      const result = await fetcher()
      data.value = result
      cache.set(key, result)
    } finally {
      loading.value = false
    }
  }
  
  return { data, loading, fetch }
}
```

## 错误处理

### 全局错误处理
```typescript
// main.ts
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Component instance:', instance)
  console.error('Error info:', info)
  
  // 发送错误报告
  errorReporter.report(err, { instance, info })
}

// 未捕获的Promise错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  errorReporter.report(event.reason)
})
```

### 错误边界组件
```vue
<!-- components/common/ErrorBoundary.vue -->
<template>
  <div v-if="hasError" class="error-boundary">
    <el-result
      icon="error"
      title="出现了一些问题"
      :sub-title="errorMessage"
    >
      <template #extra>
        <el-button type="primary" @click="retry">
          重试
        </el-button>
        <el-button @click="goHome">
          返回首页
        </el-button>
      </template>
    </el-result>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
const hasError = ref(false)
const errorMessage = ref('')

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
}

const goHome = () => {
  router.push('/')
}

onErrorCaptured((err) => {
  hasError.value = true
  errorMessage.value = err.message
  return false
})
</script>
```

## 测试策略

### 单元测试
```typescript
// tests/components/DataTable.test.ts
import { mount } from '@vue/test-utils'
import DataTable from '@/components/common/DataTable.vue'

describe('DataTable', () => {
  it('renders table with data', () => {
    const wrapper = mount(DataTable, {
      props: {
        data: [{ id: 1, name: 'Test' }],
        columns: [
          { prop: 'id', label: 'ID' },
          { prop: 'name', label: 'Name' }
        ]
      }
    })
    
    expect(wrapper.find('.data-table').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test')
  })
})
```

### E2E测试
```typescript
// tests/e2e/ai-development.spec.ts
import { test, expect } from '@playwright/test'

test('AI项目管理流程', async ({ page }) => {
  await page.goto('/ai/projects')
  
  // 创建项目
  await page.click('[data-testid="create-project"]')
  await page.fill('[data-testid="project-name"]', '测试项目')
  await page.click('[data-testid="submit"]')
  
  // 验证项目创建成功
  await expect(page.locator('[data-testid="project-list"]')).toContainText('测试项目')
})
```

---

*此设计文档将随着开发进展持续更新和完善*