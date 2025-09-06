# AI开发平台设计文档

## 概述

AI开发平台是整个个人工作台项目的核心模块，采用前后端分离架构，为用户提供统一的AI工具管理、项目上下文管理和工作流编排能力。

## 系统架构

### 整体架构
```
┌─────────────────────────────────────────────────────────────┐
│                    前端层 (Frontend)                        │
├─────────────────────────────────────────────────────────────┤
│  Vue 3 + TypeScript + Element Plus + Pinia                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ AI管理界面   │ │ 项目管理界面 │ │ 工作流编排   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                         HTTP/WebSocket
                              │
┌─────────────────────────────────────────────────────────────┐
│                    后端层 (Backend)                         │
├─────────────────────────────────────────────────────────────┤
│  Node.js + Express + TypeScript                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ API Gateway │ │ 业务逻辑层   │ │ 数据访问层   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   存储层 (Storage)                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 文件系统     │ │ SQLite数据库 │ │ Redis缓存   │          │
│  │ (配置/上下文) │ │ (元数据)     │ │ (会话)      │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### 技术栈

#### 前端技术栈
- **框架**: Vue 3 + Composition API
- **语言**: TypeScript
- **UI库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **构建工具**: Vite
- **HTTP客户端**: Axios
- **实时通信**: Socket.io-client

#### 后端技术栈
- **运行时**: Node.js 18+
- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: SQLite (轻量级，适合个人使用)
- **缓存**: Redis (可选，用于会话和临时数据)
- **实时通信**: Socket.io
- **文件处理**: fs-extra, chokidar
- **进程管理**: PM2

## 数据模型设计

### 核心实体模型

#### 1. 项目模型 (Project)
```typescript
interface Project {
  id: string
  name: string
  type: ProjectType
  path: string
  gitRepository?: string
  currentBranch?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  config: ProjectConfig
}

interface ProjectConfig {
  aiModels: string[]
  mcpServers: string[]
  workflowTemplates: string[]
  promptCategories: string[]
}

enum ProjectType {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  FULLSTACK = 'fullstack',
  MOBILE = 'mobile',
  GAME = 'game',
  AI_ML = 'ai_ml',
  OTHER = 'other'
}
```

#### 2. API Token模型 (ApiToken)
```typescript
interface ApiToken {
  id: string
  name: string
  provider: AIProvider
  token: string // 加密存储
  endpoint?: string
  model?: string
  maxTokens?: number
  isActive: boolean
  usageStats: TokenUsageStats
  createdAt: Date
  updatedAt: Date
}

interface TokenUsageStats {
  totalRequests: number
  totalTokens: number
  totalCost: number
  lastUsed?: Date
}

enum AIProvider {
  OPENAI = 'openai',
  CLAUDE = 'claude',
  GEMINI = 'gemini',
  QWEN = 'qwen',
  CUSTOM = 'custom'
}
```

#### 3. 提示词模型 (Prompt)
```typescript
interface Prompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  projectId?: string
  branchName?: string
  variables: PromptVariable[]
  version: number
  isTemplate: boolean
  createdAt: Date
  updatedAt: Date
}

interface PromptVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'file'
  description?: string
  defaultValue?: any
  required: boolean
}
```

#### 4. MCP服务模型 (McpServer)
```typescript
interface McpServer {
  id: string
  name: string
  description?: string
  command: string
  args: string[]
  env: Record<string, string>
  workingDirectory?: string
  autoStart: boolean
  status: McpServerStatus
  projectId?: string
  config: McpServerConfig
  createdAt: Date
  updatedAt: Date
}

enum McpServerStatus {
  STOPPED = 'stopped',
  STARTING = 'starting',
  RUNNING = 'running',
  ERROR = 'error'
}
```

#### 5. 智能体模型 (Agent)
```typescript
interface Agent {
  id: string
  name: string
  description?: string
  type: AgentType
  config: AgentConfig
  projectId?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface AgentConfig {
  aiModel: string
  systemPrompt: string
  tools: string[]
  maxIterations?: number
  temperature?: number
  contextWindow?: number
}

enum AgentType {
  CODING = 'coding',
  RESEARCH = 'research',
  CONTENT = 'content',
  ANALYSIS = 'analysis',
  CUSTOM = 'custom'
}
```

#### 6. 工作流模型 (Workflow)
```typescript
interface Workflow {
  id: string
  name: string
  description?: string
  projectId?: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  variables: WorkflowVariable[]
  triggers: WorkflowTrigger[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface WorkflowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: NodeData
}

interface WorkflowEdge {
  id: string
  source: string
  target: string
  condition?: string
}

enum NodeType {
  START = 'start',
  END = 'end',
  AI_TASK = 'ai_task',
  SCRIPT = 'script',
  CONDITION = 'condition',
  PARALLEL = 'parallel',
  MERGE = 'merge'
}
```

## 文件系统设计

### 目录结构
```
/workstand-data/
├── projects/                    # 项目数据
│   └── {project-id}/
│       ├── config/
│       │   ├── project.json     # 项目配置
│       │   ├── ai-models.json   # AI模型配置
│       │   └── mcp-servers.json # MCP服务配置
│       ├── contexts/            # 上下文数据
│       │   └── {branch-name}/
│       │       ├── context.json # 分支上下文
│       │       ├── prompts/     # 分支提示词
│       │       └── history/     # 上下文历史
│       └── workflows/           # 工作流定义
│           └── {workflow-id}.json
├── global/                      # 全局配置
│   ├── api-tokens.json         # API Token配置
│   ├── prompts/                # 全局提示词库
│   ├── agents/                 # 智能体定义
│   └── templates/              # 项目模板
└── cache/                      # 缓存数据
    ├── mcp-registry/           # MCP注册表缓存
    └── ai-responses/           # AI响应缓存
```

## API接口设计

### RESTful API 规范

#### 项目管理 API
```typescript
// 项目CRUD
GET    /api/projects                    # 获取项目列表
POST   /api/projects                    # 创建项目
GET    /api/projects/:id                # 获取项目详情
PUT    /api/projects/:id                # 更新项目
DELETE /api/projects/:id                # 删除项目

// 项目类型检测
POST   /api/projects/detect-type        # 检测项目类型
GET    /api/projects/:id/branches       # 获取Git分支列表
POST   /api/projects/:id/switch-branch  # 切换分支
```

#### API Token管理 API
```typescript
GET    /api/tokens                      # 获取Token列表
POST   /api/tokens                      # 添加Token
PUT    /api/tokens/:id                  # 更新Token
DELETE /api/tokens/:id                  # 删除Token
POST   /api/tokens/:id/test             # 测试Token有效性
GET    /api/tokens/:id/usage            # 获取使用统计
```

#### 提示词管理 API
```typescript
GET    /api/prompts                     # 获取提示词列表
POST   /api/prompts                     # 创建提示词
PUT    /api/prompts/:id                 # 更新提示词
DELETE /api/prompts/:id                 # 删除提示词
GET    /api/prompts/categories          # 获取分类列表
GET    /api/prompts/search              # 搜索提示词
```

#### MCP管理 API
```typescript
GET    /api/mcp/servers                 # 获取MCP服务列表
POST   /api/mcp/servers                 # 添加MCP服务
PUT    /api/mcp/servers/:id             # 更新MCP服务
DELETE /api/mcp/servers/:id             # 删除MCP服务
POST   /api/mcp/servers/:id/start       # 启动MCP服务
POST   /api/mcp/servers/:id/stop        # 停止MCP服务
GET    /api/mcp/registry                # 获取MCP注册表
POST   /api/mcp/registry/sync           # 同步MCP注册表
```

#### 智能体管理 API
```typescript
GET    /api/agents                      # 获取智能体列表
POST   /api/agents                      # 创建智能体
PUT    /api/agents/:id                  # 更新智能体
DELETE /api/agents/:id                  # 删除智能体
POST   /api/agents/:id/execute          # 执行智能体任务
GET    /api/agents/:id/logs             # 获取执行日志
```

#### 工作流管理 API
```typescript
GET    /api/workflows                   # 获取工作流列表
POST   /api/workflows                   # 创建工作流
PUT    /api/workflows/:id               # 更新工作流
DELETE /api/workflows/:id               # 删除工作流
POST   /api/workflows/:id/execute       # 执行工作流
GET    /api/workflows/:id/status        # 获取执行状态
POST   /api/workflows/:id/stop          # 停止工作流
```

### WebSocket 事件

#### 实时通信事件
```typescript
// 客户端 -> 服务端
interface ClientEvents {
  'project:watch': (projectId: string) => void
  'workflow:subscribe': (workflowId: string) => void
  'mcp:subscribe': (serverId: string) => void
}

// 服务端 -> 客户端
interface ServerEvents {
  'project:updated': (project: Project) => void
  'workflow:progress': (data: WorkflowProgress) => void
  'mcp:status': (data: McpServerStatus) => void
  'system:notification': (notification: Notification) => void
}
```

## 前端组件架构

### 组件层次结构
```
src/
├── components/                  # 通用组件
│   ├── common/                 # 基础组件
│   │   ├── FileTree.vue       # 文件树组件
│   │   ├── CodeEditor.vue     # 代码编辑器
│   │   └── JsonEditor.vue     # JSON编辑器
│   ├── ai/                    # AI相关组件
│   │   ├── TokenManager.vue   # Token管理
│   │   ├── PromptEditor.vue   # 提示词编辑器
│   │   └── ModelSelector.vue  # 模型选择器
│   └── workflow/              # 工作流组件
│       ├── FlowEditor.vue     # 流程编辑器
│       ├── NodePalette.vue    # 节点面板
│       └── ExecutionLog.vue   # 执行日志
├── views/                     # 页面组件
│   ├── ai-development/        # AI开发页面
│   │   ├── Dashboard.vue      # 仪表板
│   │   ├── Projects.vue       # 项目管理
│   │   ├── Tokens.vue         # Token管理
│   │   ├── Prompts.vue        # 提示词管理
│   │   ├── MCP.vue            # MCP管理
│   │   ├── Agents.vue         # 智能体管理
│   │   └── Workflows.vue      # 工作流管理
│   └── shared/                # 共享页面
├── stores/                    # Pinia状态管理
│   ├── project.ts            # 项目状态
│   ├── ai.ts                 # AI相关状态
│   ├── workflow.ts           # 工作流状态
│   └── user.ts               # 用户状态
└── services/                  # API服务
    ├── api.ts                # API客户端
    ├── websocket.ts          # WebSocket客户端
    └── file-system.ts        # 文件系统服务
```

### 核心组件设计

#### 1. 项目管理组件 (ProjectManager.vue)
```vue
<template>
  <div class="project-manager">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>项目管理</span>
          <el-button type="primary" @click="createProject">
            新建项目
          </el-button>
        </div>
      </template>
      
      <el-table :data="projects" style="width: 100%">
        <el-table-column prop="name" label="项目名称" />
        <el-table-column prop="type" label="项目类型" />
        <el-table-column prop="currentBranch" label="当前分支" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" @click="openProject(row)">
              打开
            </el-button>
            <el-button size="small" type="danger" @click="deleteProject(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
```

#### 2. 工作流编辑器 (WorkflowEditor.vue)
```vue
<template>
  <div class="workflow-editor">
    <div class="editor-toolbar">
      <el-button-group>
        <el-button @click="saveWorkflow">保存</el-button>
        <el-button @click="executeWorkflow">执行</el-button>
        <el-button @click="stopWorkflow">停止</el-button>
      </el-button-group>
    </div>
    
    <div class="editor-content">
      <div class="node-palette">
        <NodePalette @node-drag="onNodeDrag" />
      </div>
      
      <div class="flow-canvas">
        <FlowCanvas 
          :nodes="workflow.nodes"
          :edges="workflow.edges"
          @node-add="onNodeAdd"
          @edge-add="onEdgeAdd"
        />
      </div>
      
      <div class="properties-panel">
        <NodeProperties 
          :selected-node="selectedNode"
          @update="onNodeUpdate"
        />
      </div>
    </div>
  </div>
</template>
```

## 安全设计

### 数据安全
- **API Token加密**: 使用AES-256加密存储敏感的API Token
- **文件权限**: 严格控制配置文件的读写权限
- **输入验证**: 所有用户输入进行严格验证和清理
- **CORS配置**: 合理配置跨域访问策略

### 访问控制
- **本地访问**: 默认只允许本地访问，可配置远程访问
- **会话管理**: 使用JWT进行会话管理
- **操作日志**: 记录所有重要操作的审计日志

## 性能优化

### 前端优化
- **懒加载**: 路由和组件按需加载
- **虚拟滚动**: 大列表使用虚拟滚动
- **缓存策略**: 合理使用浏览器缓存和应用缓存
- **代码分割**: 按模块分割代码包

### 后端优化
- **连接池**: 数据库连接池管理
- **缓存层**: Redis缓存热点数据
- **异步处理**: 长时间任务异步执行
- **资源限制**: 合理限制并发请求数量

## 部署方案

### 开发环境
```bash
# 前端开发服务器
npm run dev

# 后端开发服务器
npm run dev:server

# 数据库初始化
npm run db:init
```

### 生产环境
```bash
# 构建前端
npm run build

# 启动后端服务
npm run start

# 使用PM2管理进程
pm2 start ecosystem.config.js
```

### Docker部署
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY server/ ./server/

EXPOSE 3000
CMD ["npm", "start"]
```

---

*此设计文档将随着开发进展持续更新和完善*