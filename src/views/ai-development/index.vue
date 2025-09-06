<template>
  <div class="ai-development">
    <el-row :gutter="20">
      <!-- 项目概览卡片 -->
      <el-col :span="8">
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <el-icon><Cpu /></el-icon>
              <span>AI开发中心</span>
            </div>
          </template>
          <div class="stats">
            <div class="stat-item">
              <span class="label">活跃项目</span>
              <span class="value">{{ stats.activeProjects }}</span>
            </div>
            <div class="stat-item">
              <span class="label">AI模型</span>
              <span class="value">{{ stats.aiModels }}</span>
            </div>
            <div class="stat-item">
              <span class="label">工作流</span>
              <span class="value">{{ stats.workflows }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 快速操作 -->
      <el-col :span="16">
        <el-card class="quick-actions">
          <template #header>
            <span>快速操作</span>
          </template>
          <div class="actions-grid">
            <div class="action-item" @click="createProject">
              <el-icon><Plus /></el-icon>
              <span>新建项目</span>
            </div>
            <div class="action-item" @click="openWorkflow">
              <el-icon><Connection /></el-icon>
              <span>工作流编排</span>
            </div>
            <div class="action-item" @click="manageTokens">
              <el-icon><Key /></el-icon>
              <span>API配置</span>
            </div>
            <div class="action-item" @click="promptLibrary">
              <el-icon><Document /></el-icon>
              <span>提示词库</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近项目 -->
    <el-card class="recent-projects" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>最近项目</span>
          <el-button type="primary" size="small" @click="viewAllProjects">
            查看全部
          </el-button>
        </div>
      </template>
      <el-table :data="recentProjects" style="width: 100%">
        <el-table-column prop="name" label="项目名称" />
        <el-table-column prop="type" label="项目类型">
          <template #default="{ row }">
            <el-tag :type="getProjectTypeColor(row.type)">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastModified" label="最后修改" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" @click="openProject(row)">
              打开
            </el-button>
            <el-button size="small" type="primary" @click="continueWork(row)">
              继续工作
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- AI助手面板 -->
    <el-drawer v-model="aiAssistantVisible" title="AI开发助手" size="400px">
      <div class="ai-assistant">
        <div class="chat-messages" ref="chatMessages">
          <div 
            v-for="message in chatHistory" 
            :key="message.id"
            :class="['message', message.type]"
          >
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
        <div class="chat-input">
          <el-input
            v-model="currentMessage"
            placeholder="询问AI助手..."
            @keyup.enter="sendMessage"
          >
            <template #append>
              <el-button @click="sendMessage" :loading="sending">
                发送
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </el-drawer>

    <!-- 浮动AI助手按钮 -->
    <el-button 
      class="ai-assistant-btn"
      type="primary" 
      circle 
      @click="aiAssistantVisible = true"
    >
      <el-icon><ChatDotRound /></el-icon>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 响应式数据
const stats = reactive({
  activeProjects: 5,
  aiModels: 8,
  workflows: 12
})

const recentProjects = ref([
  {
    id: 1,
    name: 'Vue3管理系统',
    type: 'Frontend',
    status: '开发中',
    lastModified: '2小时前'
  },
  {
    id: 2,
    name: 'Node.js API',
    type: 'Backend',
    status: '测试中',
    lastModified: '1天前'
  },
  {
    id: 3,
    name: 'React Native App',
    type: 'Mobile',
    status: '已完成',
    lastModified: '3天前'
  }
])

const aiAssistantVisible = ref(false)
const chatHistory = ref([
  {
    id: 1,
    type: 'assistant',
    content: '你好！我是你的AI开发助手，有什么可以帮助你的吗？',
    timestamp: new Date()
  }
])
const currentMessage = ref('')
const sending = ref(false)

// 方法
const createProject = () => {
  router.push('/ai-development/projects/create')
}

const openWorkflow = () => {
  router.push('/ai-development/workflows')
}

const manageTokens = () => {
  router.push('/ai-development/tokens')
}

const promptLibrary = () => {
  router.push('/ai-development/prompts')
}

const viewAllProjects = () => {
  router.push('/ai-development/projects')
}

const openProject = (project: any) => {
  router.push(`/ai-development/projects/${project.id}`)
}

const continueWork = (project: any) => {
  ElMessage.success(`正在为项目 ${project.name} 恢复工作上下文...`)
  // 这里会调用AI服务恢复项目上下文
  setTimeout(() => {
    router.push(`/ai-development/projects/${project.id}/workspace`)
  }, 1000)
}

const getProjectTypeColor = (type: string) => {
  const colors = {
    'Frontend': 'success',
    'Backend': 'warning',
    'Mobile': 'info',
    'Fullstack': 'primary'
  }
  return colors[type] || 'default'
}

const getStatusColor = (status: string) => {
  const colors = {
    '开发中': 'warning',
    '测试中': 'info',
    '已完成': 'success',
    '暂停': 'danger'
  }
  return colors[status] || 'default'
}

const sendMessage = async () => {
  if (!currentMessage.value.trim()) return
  
  // 添加用户消息
  chatHistory.value.push({
    id: Date.now(),
    type: 'user',
    content: currentMessage.value,
    timestamp: new Date()
  })
  
  const userMessage = currentMessage.value
  currentMessage.value = ''
  sending.value = true
  
  try {
    // 模拟AI响应
    setTimeout(() => {
      chatHistory.value.push({
        id: Date.now(),
        type: 'assistant',
        content: `我理解你想要${userMessage}。让我为你提供一些建议...`,
        timestamp: new Date()
      })
      sending.value = false
    }, 1000)
  } catch (error) {
    ElMessage.error('AI助手暂时无法响应，请稍后再试')
    sending.value = false
  }
}

const formatTime = (time: Date) => {
  return time.toLocaleTimeString()
}

onMounted(() => {
  // 初始化数据
  console.log('AI开发中心已加载')
})
</script>

<style scoped lang="scss">
.ai-development {
  padding: 20px;
  
  .overview-card {
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: bold;
    }
    
    .stats {
      .stat-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        
        .label {
          color: #666;
        }
        
        .value {
          font-weight: bold;
          color: #409eff;
        }
      }
    }
  }
  
  .quick-actions {
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      
      .action-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        border: 2px dashed #e4e7ed;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          border-color: #409eff;
          background-color: #f0f9ff;
        }
        
        .el-icon {
          font-size: 24px;
          margin-bottom: 8px;
          color: #409eff;
        }
        
        span {
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }
  
  .recent-projects {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  
  .ai-assistant-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    font-size: 24px;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    z-index: 1000;
  }
  
  .ai-assistant {
    height: 100%;
    display: flex;
    flex-direction: column;
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      
      .message {
        margin-bottom: 16px;
        
        &.user {
          text-align: right;
          
          .message-content {
            background-color: #409eff;
            color: white;
            display: inline-block;
            padding: 8px 12px;
            border-radius: 12px;
            max-width: 80%;
          }
        }
        
        &.assistant {
          text-align: left;
          
          .message-content {
            background-color: #f5f7fa;
            color: #303133;
            display: inline-block;
            padding: 8px 12px;
            border-radius: 12px;
            max-width: 80%;
          }
        }
        
        .message-time {
          font-size: 12px;
          color: #909399;
          margin-top: 4px;
        }
      }
    }
    
    .chat-input {
      padding: 16px;
      border-top: 1px solid #e4e7ed;
    }
  }
}
</style>