# 爬虫管理平台设计文档

## 概述

爬虫管理平台是个人工作台项目的核心基础设施，采用前后端分离架构，为AI开发平台、MCP管理、内容聚合等模块提供强大的数据采集能力。

## 系统架构

### 整体架构
```
┌─────────────────────────────────────────────────────────────┐
│                    前端管理界面                              │
├─────────────────────────────────────────────────────────────┤
│  Vue 3 + Element Plus                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 任务管理     │ │ 规则配置     │ │ 数据监控     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                         HTTP/WebSocket
                              │
┌─────────────────────────────────────────────────────────────┐
│                    爬虫引擎层                                │
├─────────────────────────────────────────────────────────────┤
│  Node.js + Puppeteer + Playwright                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 任务调度器   │ │ 爬虫执行器   │ │ 反爬处理器   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    数据处理层                                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 数据清洗     │ │ 数据存储     │ │ 数据导出     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### 技术栈

#### 爬虫引擎
- **浏览器自动化**: Puppeteer, Playwright
- **HTTP客户端**: Axios, Got
- **HTML解析**: Cheerio, jsdom
- **任务队列**: Bull Queue (Redis)
- **代理管理**: proxy-chain
- **验证码识别**: tesseract.js, 第三方API

#### 数据处理
- **数据清洗**: lodash, validator
- **数据存储**: SQLite, JSON文件
- **数据导出**: csv-writer, xlsx
- **文件处理**: fs-extra, archiver

## 数据模型设计

### 核心实体模型

#### 1. 爬虫任务模型 (SpiderTask)
```typescript
interface SpiderTask {
  id: string
  name: string
  description?: string
  targetUrl: string
  taskType: TaskType
  config: SpiderConfig
  schedule?: ScheduleConfig
  status: TaskStatus
  lastRun?: Date
  nextRun?: Date
  createdAt: Date
  updatedAt: Date
  stats: TaskStats
}

enum TaskType {
  SINGLE_PAGE = 'single_page',
  MULTI_PAGE = 'multi_page',
  INFINITE_SCROLL = 'infinite_scroll',
  API_CRAWL = 'api_crawl',
  MCP_DISCOVERY = 'mcp_discovery'
}

enum TaskStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed'
}
```

#### 2. 爬虫配置模型 (SpiderConfig)
```typescript
interface SpiderConfig {
  // 基础配置
  method: 'GET' | 'POST'
  headers: Record<string, string>
  cookies?: Cookie[]
  timeout: number
  retryCount: number
  
  // 数据提取规则
  extractRules: ExtractRule[]
  
  // 反爬策略
  antiBot: AntiBotConfig
  
  // 账号配置
  accountConfig?: AccountConfig
  
  // 输出配置
  output: OutputConfig
}

interface ExtractRule {
  field: string
  selector: string
  selectorType: 'css' | 'xpath' | 'regex'
  attribute?: string
  transform?: TransformRule[]
  required: boolean
}

interface AntiBotConfig {
  useProxy: boolean
  proxyPool?: string[]
  userAgentRotation: boolean
  requestDelay: { min: number; max: number }
  headless: boolean
  viewport?: { width: number; height: number }
  blockResources: string[]
}
```

#### 3. 书签集成模型 (BookmarkIntegration)
```typescript
interface BookmarkSite {
  id: string
  bookmarkId: string
  url: string
  title: string
  category: string
  tags: string[]
  spiderTasks: string[] // 关联的爬虫任务ID
  autoUpdate: boolean
  updateFrequency: UpdateFrequency
  lastUpdated?: Date
}

enum UpdateFrequency {
  REAL_TIME = 'real_time',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}
```

#### 4. 数据存储模型 (CrawledData)
```typescript
interface CrawledData {
  id: string
  taskId: string
  url: string
  data: Record<string, any>
  metadata: CrawlMetadata
  createdAt: Date
}

interface CrawlMetadata {
  userAgent: string
  ip?: string
  responseTime: number
  statusCode: number
  contentType: string
  size: number
  hash: string // 用于去重
}
```

## 核心功能设计

### 1. 任务调度系统

#### 调度器架构
```typescript
class TaskScheduler {
  private queue: Queue
  private workers: Map<string, Worker>
  
  async scheduleTask(task: SpiderTask): Promise<void> {
    const job = await this.queue.add('spider-task', {
      taskId: task.id,
      config: task.config
    }, {
      delay: this.calculateDelay(task.schedule),
      repeat: this.parseSchedule(task.schedule)
    })
  }
  
  async executeTask(taskId: string): Promise<CrawlResult> {
    const worker = this.getAvailableWorker()
    return await worker.execute(taskId)
  }
}
```

#### Cron表达式支持
```typescript
interface ScheduleConfig {
  type: 'cron' | 'interval' | 'once'
  expression: string // Cron表达式或间隔时间
  timezone?: string
  enabled: boolean
}
```

### 2. 反爬虫处理系统

#### 代理轮换
```typescript
class ProxyManager {
  private proxyPool: Proxy[]
  private failedProxies: Set<string>
  
  async getProxy(): Promise<Proxy> {
    const availableProxies = this.proxyPool.filter(
      p => !this.failedProxies.has(p.id) && p.isActive
    )
    return this.selectProxy(availableProxies)
  }
  
  markProxyFailed(proxyId: string): void {
    this.failedProxies.add(proxyId)
    // 设置恢复时间
    setTimeout(() => {
      this.failedProxies.delete(proxyId)
    }, 300000) // 5分钟后重试
  }
}
```

#### User-Agent轮换
```typescript
class UserAgentManager {
  private userAgents: string[]
  private usageStats: Map<string, number>
  
  getRandomUserAgent(): string {
    // 基于使用频率选择User-Agent
    const weights = this.calculateWeights()
    return this.weightedRandom(this.userAgents, weights)
  }
}
```

### 3. 数据提取引擎

#### 规则引擎
```typescript
class ExtractionEngine {
  async extract(html: string, rules: ExtractRule[]): Promise<Record<string, any>> {
    const result: Record<string, any> = {}
    
    for (const rule of rules) {
      try {
        const value = await this.applyRule(html, rule)
        result[rule.field] = this.transform(value, rule.transform)
      } catch (error) {
        if (rule.required) {
          throw new ExtractionError(`Required field ${rule.field} extraction failed`)
        }
      }
    }
    
    return result
  }
  
  private async applyRule(html: string, rule: ExtractRule): Promise<any> {
    switch (rule.selectorType) {
      case 'css':
        return this.extractByCSS(html, rule.selector, rule.attribute)
      case 'xpath':
        return this.extractByXPath(html, rule.selector, rule.attribute)
      case 'regex':
        return this.extractByRegex(html, rule.selector)
    }
  }
}
```

### 4. MCP数据采集

#### MCP发现服务
```typescript
class McpDiscoveryService {
  async discoverMcpServers(sources: string[]): Promise<McpServerInfo[]> {
    const results: McpServerInfo[] = []
    
    for (const source of sources) {
      if (source.includes('github.com')) {
        results.push(...await this.discoverFromGitHub(source))
      } else if (source.includes('npmjs.com')) {
        results.push(...await this.discoverFromNpm(source))
      }
    }
    
    return this.deduplicateServers(results)
  }
  
  private async discoverFromGitHub(repoUrl: string): Promise<McpServerInfo[]> {
    // 爬取GitHub仓库，查找MCP相关配置
    const task = new SpiderTask({
      targetUrl: repoUrl,
      extractRules: [
        {
          field: 'mcpConfig',
          selector: 'script[type="application/json"]',
          selectorType: 'css'
        }
      ]
    })
    
    return await this.executeDiscoveryTask(task)
  }
}
```

## API接口设计

### RESTful API

#### 爬虫任务管理
```typescript
// 任务CRUD
GET    /api/spider/tasks                # 获取任务列表
POST   /api/spider/tasks                # 创建任务
GET    /api/spider/tasks/:id            # 获取任务详情
PUT    /api/spider/tasks/:id            # 更新任务
DELETE /api/spider/tasks/:id            # 删除任务

// 任务执行控制
POST   /api/spider/tasks/:id/start      # 启动任务
POST   /api/spider/tasks/:id/stop       # 停止任务
POST   /api/spider/tasks/:id/pause      # 暂停任务
POST   /api/spider/tasks/:id/resume     # 恢复任务

// 任务数据
GET    /api/spider/tasks/:id/data       # 获取爬取数据
GET    /api/spider/tasks/:id/logs       # 获取执行日志
POST   /api/spider/tasks/:id/export     # 导出数据
```

#### 书签集成API
```typescript
GET    /api/spider/bookmarks            # 获取书签网站列表
POST   /api/spider/bookmarks/sync       # 同步书签数据
POST   /api/spider/bookmarks/:id/crawl  # 爬取书签网站
GET    /api/spider/bookmarks/:id/updates # 获取更新内容
```

#### 反爬管理API
```typescript
GET    /api/spider/proxies              # 获取代理列表
POST   /api/spider/proxies              # 添加代理
PUT    /api/spider/proxies/:id          # 更新代理
DELETE /api/spider/proxies/:id          # 删除代理
POST   /api/spider/proxies/:id/test     # 测试代理

GET    /api/spider/user-agents          # 获取User-Agent列表
POST   /api/spider/user-agents          # 添加User-Agent
```

### WebSocket事件

#### 实时状态更新
```typescript
interface SpiderEvents {
  // 任务状态变化
  'task:status': (data: { taskId: string; status: TaskStatus }) => void
  'task:progress': (data: { taskId: string; progress: number }) => void
  'task:error': (data: { taskId: string; error: string }) => void
  
  // 数据更新
  'data:new': (data: { taskId: string; count: number }) => void
  'data:exported': (data: { taskId: string; file: string }) => void
}
```

## 前端组件设计

### 核心组件

#### 1. 任务管理器 (TaskManager.vue)
```vue
<template>
  <div class="task-manager">
    <div class="toolbar">
      <el-button type="primary" @click="createTask">
        新建任务
      </el-button>
      <el-button @click="importFromBookmarks">
        从书签导入
      </el-button>
    </div>
    
    <el-table :data="tasks" style="width: 100%">
      <el-table-column prop="name" label="任务名称" />
      <el-table-column prop="targetUrl" label="目标URL" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastRun" label="最后运行" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button-group>
            <el-button size="small" @click="startTask(row)">
              启动
            </el-button>
            <el-button size="small" @click="editTask(row)">
              编辑
            </el-button>
            <el-button size="small" @click="viewData(row)">
              数据
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
```

#### 2. 规则配置器 (RuleConfigurator.vue)
```vue
<template>
  <div class="rule-configurator">
    <el-form :model="config" label-width="120px">
      <el-form-item label="目标URL">
        <el-input v-model="config.targetUrl" />
      </el-form-item>
      
      <el-form-item label="提取规则">
        <div v-for="(rule, index) in config.extractRules" :key="index">
          <el-card class="rule-card">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-input v-model="rule.field" placeholder="字段名" />
              </el-col>
              <el-col :span="6">
                <el-select v-model="rule.selectorType">
                  <el-option label="CSS选择器" value="css" />
                  <el-option label="XPath" value="xpath" />
                  <el-option label="正则表达式" value="regex" />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-input v-model="rule.selector" placeholder="选择器" />
              </el-col>
              <el-col :span="4">
                <el-button type="danger" @click="removeRule(index)">
                  删除
                </el-button>
              </el-col>
            </el-row>
          </el-card>
        </div>
        <el-button @click="addRule">添加规则</el-button>
      </el-form-item>
      
      <el-form-item label="反爬设置">
        <el-switch v-model="config.antiBot.useProxy" label="使用代理" />
        <el-switch v-model="config.antiBot.userAgentRotation" label="UA轮换" />
        <el-input-number 
          v-model="config.antiBot.requestDelay.min" 
          label="最小延迟(ms)" 
        />
      </el-form-item>
    </el-form>
  </div>
</template>
```

## 性能优化

### 并发控制
```typescript
class ConcurrencyManager {
  private maxConcurrent = 5
  private running = new Set<string>()
  private queue: TaskQueue[] = []
  
  async execute(task: SpiderTask): Promise<void> {
    if (this.running.size >= this.maxConcurrent) {
      await this.enqueue(task)
    } else {
      await this.runTask(task)
    }
  }
}
```

### 数据去重
```typescript
class DeduplicationService {
  private hashCache = new Map<string, string>()
  
  isDuplicate(data: CrawledData): boolean {
    const hash = this.calculateHash(data.data)
    if (this.hashCache.has(hash)) {
      return true
    }
    this.hashCache.set(hash, data.id)
    return false
  }
}
```

### 缓存策略
```typescript
class CacheManager {
  private redis: Redis
  
  async cacheResponse(url: string, response: any, ttl = 3600): Promise<void> {
    await this.redis.setex(`spider:cache:${url}`, ttl, JSON.stringify(response))
  }
  
  async getCachedResponse(url: string): Promise<any> {
    const cached = await this.redis.get(`spider:cache:${url}`)
    return cached ? JSON.parse(cached) : null
  }
}
```

## 部署配置

### Docker配置
```dockerfile
FROM node:18-alpine

# 安装浏览器依赖
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# 设置Puppeteer使用系统Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 3001

CMD ["npm", "run", "start:spider"]
```

### 环境配置
```yaml
# docker-compose.yml
version: '3.8'
services:
  spider-engine:
    build: .
    ports:
      - "3001:3001"
    environment:
      - REDIS_URL=redis://redis:6379
      - NODE_ENV=production
    depends_on:
      - redis
    volumes:
      - ./data:/app/data
      
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

---

*此设计文档将随着开发进展持续更新和完善*