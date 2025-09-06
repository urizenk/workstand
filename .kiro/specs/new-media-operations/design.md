# 新媒体运营模块设计文档

## 概述

新媒体运营模块是个人工作台项目的重要业务模块，采用前后端分离架构，通过AI技术实现内容创作、多平台发布、数据分析的全流程自动化。

## 系统架构

### 整体架构
```
┌─────────────────────────────────────────────────────────────┐
│                    前端运营界面                              │
├─────────────────────────────────────────────────────────────┤
│  Vue 3 + Element Plus                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 内容创作     │ │ 发布管理     │ │ 数据分析     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                         HTTP/WebSocket
                              │
┌─────────────────────────────────────────────────────────────┐
│                    内容处理层                                │
├─────────────────────────────────────────────────────────────┤
│  Node.js + AI集成                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ AI内容生成   │ │ 素材处理     │ │ 工作流引擎   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    平台发布层                                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 平台适配器   │ │ 发布调度     │ │ 数据收集     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### 技术栈

#### 内容创作
- **AI集成**: OpenAI API, Claude API
- **图像处理**: Sharp, Canvas API
- **视频处理**: FFmpeg, node-ffmpeg
- **文本处理**: natural, compromise

#### 平台集成
- **API客户端**: 各平台官方API
- **浏览器自动化**: Puppeteer (备用方案)
- **文件上传**: multer, form-data
- **媒体转换**: imagemin, video-converter

## 数据模型设计

### 核心实体模型

#### 1. 内容项目模型 (ContentProject)
```typescript
interface ContentProject {
  id: string
  name: string
  description?: string
  category: ContentCategory
  targetPlatforms: Platform[]
  contentType: ContentType
  aiConfig: AIContentConfig
  schedule?: PublishSchedule
  status: ProjectStatus
  createdAt: Date
  updatedAt: Date
  stats: ProjectStats
}

enum ContentCategory {
  TECH = 'tech',
  LIFESTYLE = 'lifestyle',
  EDUCATION = 'education',
  ENTERTAINMENT = 'entertainment',
  BUSINESS = 'business',
  OTHER = 'other'
}

enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  MIXED = 'mixed'
}

enum Platform {
  DOUYIN = 'douyin',
  XIAOHONGSHU = 'xiaohongshu',
  BILIBILI = 'bilibili',
  WEIBO = 'weibo',
  WECHAT = 'wechat',
  YOUTUBE = 'youtube'
}
```

#### 2. 内容模板模型 (ContentTemplate)
```typescript
interface ContentTemplate {
  id: string
  name: string
  category: ContentCategory
  contentType: ContentType
  template: TemplateStructure
  variables: TemplateVariable[]
  platforms: Platform[]
  aiPrompts: AIPromptConfig[]
  createdAt: Date
  updatedAt: Date
}

interface TemplateStructure {
  title: string
  content: string
  tags: string[]
  cover?: string
  attachments?: string[]
}

interface TemplateVariable {
  name: string
  type: 'text' | 'number' | 'image' | 'video' | 'list'
  description?: string
  defaultValue?: any
  required: boolean
}
```

#### 3. 发布任务模型 (PublishTask)
```typescript
interface PublishTask {
  id: string
  projectId: string
  content: GeneratedContent
  targetPlatforms: PlatformConfig[]
  schedule: PublishSchedule
  status: TaskStatus
  results: PublishResult[]
  createdAt: Date
  executedAt?: Date
}

interface GeneratedContent {
  title: string
  content: string
  tags: string[]
  media: MediaFile[]
  metadata: ContentMetadata
}

interface PlatformConfig {
  platform: Platform
  accountId: string
  customization: PlatformCustomization
}

interface PlatformCustomization {
  title?: string
  content?: string
  tags?: string[]
  cover?: string
  publishTime?: Date
}
```

#### 4. 素材库模型 (MediaAsset)
```typescript
interface MediaAsset {
  id: string
  name: string
  type: MediaType
  category: string
  tags: string[]
  file: FileInfo
  metadata: MediaMetadata
  usage: AssetUsage[]
  createdAt: Date
  updatedAt: Date
}

enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document'
}

interface FileInfo {
  path: string
  size: number
  mimeType: string
  dimensions?: { width: number; height: number }
  duration?: number
}

interface MediaMetadata {
  source: 'upload' | 'ai_generated' | 'downloaded'
  aiModel?: string
  prompt?: string
  license?: string
  copyright?: string
}
```

#### 5. 平台账号模型 (PlatformAccount)
```typescript
interface PlatformAccount {
  id: string
  platform: Platform
  accountName: string
  credentials: AccountCredentials
  profile: AccountProfile
  status: AccountStatus
  limitations: PlatformLimitations
  stats: AccountStats
  createdAt: Date
  updatedAt: Date
}

interface AccountCredentials {
  accessToken?: string
  refreshToken?: string
  apiKey?: string
  cookies?: string
  sessionData?: Record<string, any>
}

interface PlatformLimitations {
  dailyPostLimit: number
  videoSizeLimit: number
  imageSizeLimit: number
  textLengthLimit: number
  tagLimit: number
}
```

## 核心功能设计

### 1. AI内容生成引擎

#### 内容生成服务
```typescript
class ContentGenerationService {
  private aiClients: Map<string, AIClient>
  
  async generateContent(
    template: ContentTemplate,
    variables: Record<string, any>,
    platform: Platform
  ): Promise<GeneratedContent> {
    
    // 选择合适的AI模型
    const aiModel = this.selectAIModel(template.contentType, platform)
    
    // 构建提示词
    const prompt = this.buildPrompt(template, variables, platform)
    
    // 生成内容
    const content = await this.aiClients.get(aiModel).generate(prompt)
    
    // 平台适配
    return this.adaptToPlatform(content, platform)
  }
  
  private buildPrompt(
    template: ContentTemplate,
    variables: Record<string, any>,
    platform: Platform
  ): string {
    let prompt = template.aiPrompts.find(p => p.platform === platform)?.prompt || template.aiPrompts[0].prompt
    
    // 替换变量
    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
    })
    
    return prompt
  }
}
```

#### 多模态内容生成
```typescript
class MultimodalContentService {
  async generateVideoContent(script: string, style: VideoStyle): Promise<VideoContent> {
    // 1. 生成视频脚本分镜
    const storyboard = await this.generateStoryboard(script)
    
    // 2. 生成图像素材
    const images = await Promise.all(
      storyboard.scenes.map(scene => this.generateImage(scene.description, style))
    )
    
    // 3. 生成语音
    const audio = await this.generateVoiceover(script, style.voice)
    
    // 4. 合成视频
    const video = await this.composeVideo(images, audio, storyboard.timing)
    
    return {
      video,
      script,
      storyboard,
      assets: { images, audio }
    }
  }
  
  private async generateImage(description: string, style: VideoStyle): Promise<string> {
    const prompt = `${description}, ${style.imageStyle}, high quality, professional`
    return await this.aiImageService.generate(prompt)
  }
}
```

### 2. 平台发布系统

#### 发布适配器
```typescript
abstract class PlatformAdapter {
  abstract platform: Platform
  
  abstract async publish(
    content: GeneratedContent,
    account: PlatformAccount,
    config: PlatformConfig
  ): Promise<PublishResult>
  
  abstract async getPostStats(postId: string): Promise<PostStats>
  
  protected async uploadMedia(file: MediaFile, account: PlatformAccount): Promise<string> {
    // 通用媒体上传逻辑
  }
  
  protected formatContent(content: GeneratedContent, platform: Platform): GeneratedContent {
    // 平台特定的内容格式化
  }
}

class DouyinAdapter extends PlatformAdapter {
  platform = Platform.DOUYIN
  
  async publish(
    content: GeneratedContent,
    account: PlatformAccount,
    config: PlatformConfig
  ): Promise<PublishResult> {
    try {
      // 1. 上传媒体文件
      const mediaIds = await Promise.all(
        content.media.map(media => this.uploadMedia(media, account))
      )
      
      // 2. 创建发布请求
      const publishData = {
        text: content.content,
        media_ids: mediaIds,
        tags: content.tags.slice(0, 10), // 抖音标签限制
        publish_time: config.customization.publishTime
      }
      
      // 3. 调用抖音API
      const response = await this.douyinAPI.createPost(publishData, account.credentials)
      
      return {
        success: true,
        postId: response.item_id,
        url: `https://www.douyin.com/video/${response.item_id}`,
        platform: this.platform
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        platform: this.platform
      }
    }
  }
}
```

#### 发布调度器
```typescript
class PublishScheduler {
  private queue: Queue
  private adapters: Map<Platform, PlatformAdapter>
  
  async schedulePublish(task: PublishTask): Promise<void> {
    for (const platformConfig of task.targetPlatforms) {
      await this.queue.add('publish-task', {
        taskId: task.id,
        platform: platformConfig.platform,
        content: task.content,
        config: platformConfig
      }, {
        delay: this.calculateDelay(platformConfig.publishTime),
        attempts: 3,
        backoff: 'exponential'
      })
    }
  }
  
  async executePublish(jobData: any): Promise<PublishResult> {
    const adapter = this.adapters.get(jobData.platform)
    const account = await this.getAccount(jobData.config.accountId)
    
    return await adapter.publish(jobData.content, account, jobData.config)
  }
}
```

### 3. 热点话题分析

#### 话题发现服务
```typescript
class TrendAnalysisService {
  async discoverTrends(platforms: Platform[]): Promise<TrendTopic[]> {
    const trends: TrendTopic[] = []
    
    for (const platform of platforms) {
      const platformTrends = await this.getPlatformTrends(platform)
      trends.push(...platformTrends)
    }
    
    // 去重和排序
    return this.deduplicateAndRank(trends)
  }
  
  private async getPlatformTrends(platform: Platform): Promise<TrendTopic[]> {
    switch (platform) {
      case Platform.DOUYIN:
        return await this.getDouyinTrends()
      case Platform.WEIBO:
        return await this.getWeiboTrends()
      default:
        return []
    }
  }
  
  async generateContentIdeas(trend: TrendTopic, category: ContentCategory): Promise<ContentIdea[]> {
    const prompt = `
      基于热点话题"${trend.title}"，为${category}类别生成5个内容创作想法。
      要求：
      1. 与话题相关但有独特角度
      2. 适合短视频/图文内容
      3. 有吸引力和传播性
      4. 符合平台调性
    `
    
    const response = await this.aiService.generate(prompt)
    return this.parseContentIdeas(response)
  }
}
```

### 4. 数据分析系统

#### 数据收集器
```typescript
class AnalyticsCollector {
  async collectPostData(postId: string, platform: Platform): Promise<PostAnalytics> {
    const adapter = this.adapters.get(platform)
    const stats = await adapter.getPostStats(postId)
    
    return {
      postId,
      platform,
      metrics: {
        views: stats.view_count,
        likes: stats.like_count,
        comments: stats.comment_count,
        shares: stats.share_count,
        engagement: this.calculateEngagement(stats)
      },
      demographics: stats.audience_demographics,
      timestamp: new Date()
    }
  }
  
  private calculateEngagement(stats: PostStats): number {
    const totalEngagement = stats.like_count + stats.comment_count + stats.share_count
    return stats.view_count > 0 ? (totalEngagement / stats.view_count) * 100 : 0
  }
}
```

#### 性能分析器
```typescript
class PerformanceAnalyzer {
  async analyzeContentPerformance(projectId: string): Promise<PerformanceReport> {
    const posts = await this.getProjectPosts(projectId)
    const analytics = await Promise.all(
      posts.map(post => this.collectPostData(post.id, post.platform))
    )
    
    return {
      overview: this.generateOverview(analytics),
      trends: this.analyzeTrends(analytics),
      recommendations: await this.generateRecommendations(analytics),
      topPerformers: this.getTopPerformers(analytics),
      insights: await this.generateInsights(analytics)
    }
  }
  
  private async generateRecommendations(analytics: PostAnalytics[]): Promise<string[]> {
    const prompt = `
      基于以下内容表现数据，生成5条优化建议：
      ${JSON.stringify(analytics.map(a => ({
        platform: a.platform,
        engagement: a.metrics.engagement,
        views: a.metrics.views
      })))}
    `
    
    const response = await this.aiService.generate(prompt)
    return this.parseRecommendations(response)
  }
}
```

## API接口设计

### RESTful API

#### 内容管理API
```typescript
// 项目管理
GET    /api/media/projects                # 获取项目列表
POST   /api/media/projects                # 创建项目
GET    /api/media/projects/:id            # 获取项目详情
PUT    /api/media/projects/:id            # 更新项目
DELETE /api/media/projects/:id            # 删除项目

// 内容生成
POST   /api/media/content/generate        # 生成内容
POST   /api/media/content/batch-generate  # 批量生成
GET    /api/media/content/:id             # 获取生成内容
PUT    /api/media/content/:id             # 编辑内容

// 模板管理
GET    /api/media/templates               # 获取模板列表
POST   /api/media/templates               # 创建模板
PUT    /api/media/templates/:id          # 更新模板
DELETE /api/media/templates/:id          # 删除模板
```

#### 发布管理API
```typescript
// 发布任务
POST   /api/media/publish                 # 创建发布任务
GET    /api/media/publish/:id             # 获取发布状态
POST   /api/media/publish/:id/cancel      # 取消发布
GET    /api/media/publish/history         # 获取发布历史

// 平台账号
GET    /api/media/accounts                # 获取账号列表
POST   /api/media/accounts                # 添加账号
PUT    /api/media/accounts/:id            # 更新账号
DELETE /api/media/accounts/:id            # 删除账号
POST   /api/media/accounts/:id/test       # 测试账号连接
```

#### 分析API
```typescript
// 数据分析
GET    /api/media/analytics/overview      # 获取总览数据
GET    /api/media/analytics/trends        # 获取趋势分析
GET    /api/media/analytics/performance   # 获取性能报告
GET    /api/media/analytics/competitors   # 获取竞品分析

// 热点话题
GET    /api/media/trends                  # 获取热点话题
POST   /api/media/trends/analyze          # 分析话题
GET    /api/media/trends/ideas            # 获取内容创意
```

## 前端组件设计

### 核心组件

#### 1. 内容创作工作台 (ContentWorkspace.vue)
```vue
<template>
  <div class="content-workspace">
    <div class="workspace-header">
      <el-breadcrumb>
        <el-breadcrumb-item>内容创作</el-breadcrumb-item>
        <el-breadcrumb-item>{{ project.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      
      <div class="actions">
        <el-button @click="saveContent">保存</el-button>
        <el-button type="primary" @click="generateContent">
          AI生成
        </el-button>
        <el-button type="success" @click="publishContent">
          发布
        </el-button>
      </div>
    </div>
    
    <div class="workspace-content">
      <div class="content-editor">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="文本内容" name="text">
            <ContentEditor v-model="content.text" />
          </el-tab-pane>
          <el-tab-pane label="媒体素材" name="media">
            <MediaManager v-model="content.media" />
          </el-tab-pane>
          <el-tab-pane label="发布设置" name="publish">
            <PublishSettings v-model="publishConfig" />
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <div class="sidebar">
        <AIAssistant @suggestion="applySuggestion" />
        <TrendTopics @select="applyTrend" />
        <TemplateLibrary @select="applyTemplate" />
      </div>
    </div>
  </div>
</template>
```

#### 2. 发布管理器 (PublishManager.vue)
```vue
<template>
  <div class="publish-manager">
    <div class="publish-queue">
      <h3>发布队列</h3>
      <el-timeline>
        <el-timeline-item
          v-for="task in publishTasks"
          :key="task.id"
          :timestamp="task.scheduledTime"
          :type="getTaskType(task.status)"
        >
          <el-card>
            <div class="task-header">
              <span class="task-title">{{ task.content.title }}</span>
              <el-tag :type="getStatusType(task.status)">
                {{ task.status }}
              </el-tag>
            </div>
            
            <div class="task-platforms">
              <el-tag
                v-for="platform in task.targetPlatforms"
                :key="platform.platform"
                size="small"
              >
                {{ platform.platform }}
              </el-tag>
            </div>
            
            <div class="task-actions">
              <el-button size="small" @click="editTask(task)">
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="cancelTask(task)">
                取消
              </el-button>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>
```

## 性能优化

### 内容生成优化
```typescript
class ContentCache {
  private cache = new Map<string, GeneratedContent>()
  
  async getOrGenerate(
    template: ContentTemplate,
    variables: Record<string, any>
  ): Promise<GeneratedContent> {
    const cacheKey = this.generateCacheKey(template, variables)
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }
    
    const content = await this.contentService.generate(template, variables)
    this.cache.set(cacheKey, content)
    
    return content
  }
}
```

### 媒体处理优化
```typescript
class MediaProcessor {
  async processVideo(file: Buffer, platform: Platform): Promise<Buffer> {
    const platformSpecs = this.getPlatformSpecs(platform)
    
    return await this.ffmpeg
      .input(file)
      .size(platformSpecs.resolution)
      .videoBitrate(platformSpecs.bitrate)
      .format(platformSpecs.format)
      .toBuffer()
  }
  
  async optimizeImage(file: Buffer, platform: Platform): Promise<Buffer> {
    const platformSpecs = this.getPlatformSpecs(platform)
    
    return await sharp(file)
      .resize(platformSpecs.width, platformSpecs.height)
      .jpeg({ quality: platformSpecs.quality })
      .toBuffer()
  }
}
```

---

*此设计文档将随着开发进展持续更新和完善*