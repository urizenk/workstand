<template>
  <div class="workflows-management">
    <div class="page-header">
      <h2>工作流管理</h2>
      <el-button type="primary" @click="createWorkflow">
        <el-icon><Plus /></el-icon>
        创建工作流
      </el-button>
    </div>

    <!-- 工作流列表 -->
    <el-card>
      <div class="workflows-grid">
        <div 
          v-for="workflow in workflows" 
          :key="workflow.id"
          class="workflow-card"
        >
          <div class="workflow-header">
            <div class="workflow-info">
              <h3>{{ workflow.name }}</h3>
              <p class="workflow-description">{{ workflow.description }}</p>
            </div>
            <div class="workflow-status">
              <el-tag :type="getStatusColor(workflow.status)">
                {{ workflow.status }}
              </el-tag>
            </div>
          </div>
          
          <div class="workflow-content">
            <div class="workflow-stats">
              <div class="stat-item">
                <span class="label">节点数</span>
                <span class="value">{{ workflow.nodeCount }}</span>
              </div>
              <div class="stat-item">
                <span class="label">执行次数</span>
                <span class="value">{{ workflow.executions }}</span>
              </div>
              <div class="stat-item">
                <span class="label">成功率</span>
                <span class="value">{{ workflow.successRate }}%</span>
              </div>
            </div>
            
            <div class="workflow-preview">
              <div class="nodes-preview">
                <div 
                  v-for="node in workflow.nodes.slice(0, 4)" 
                  :key="node.id"
                  class="node-preview"
                  :class="node.type"
                >
                  <el-icon><component :is="getNodeIcon(node.type)" /></el-icon>
                </div>
                <span v-if="workflow.nodes.length > 4" class="more-nodes">
                  +{{ workflow.nodes.length - 4 }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="workflow-actions">
            <el-button size="small" @click="runWorkflow(workflow)">
              <el-icon><VideoPlay /></el-icon>
              运行
            </el-button>
            <el-button size="small" @click="editWorkflow(workflow)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="small" @click="viewLogs(workflow)">
              <el-icon><Document /></el-icon>
              日志
            </el-button>
            <el-dropdown @command="handleWorkflowAction">
              <el-button size="small" circle>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="{action: 'clone', workflow}">
                    克隆
                  </el-dropdown-item>
                  <el-dropdown-item :command="{action: 'export', workflow}">
                    导出
                  </el-dropdown-item>
                  <el-dropdown-item :command="{action: 'delete', workflow}" divided>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 工作流编辑器对话框 -->
    <el-dialog 
      v-model="editorDialogVisible" 
      :title="editingWorkflow ? '编辑工作流' : '创建工作流'"
      width="90%"
      :close-on-click-modal="false"
      custom-class="workflow-editor-dialog"
    >
      <div class="workflow-editor">
        <div class="editor-toolbar">
          <div class="toolbar-left">
            <el-input 
              v-model="workflowForm.name" 
              placeholder="工作流名称"
              style="width: 200px; margin-right: 12px;"
            />
            <el-input 
              v-model="workflowForm.description" 
              placeholder="工作流描述"
              style="width: 300px;"
            />
          </div>
          <div class="toolbar-right">
            <el-button @click="saveWorkflow" :loading="saving">
              <el-icon><Check /></el-icon>
              保存
            </el-button>
            <el-button @click="testWorkflow">
              <el-icon><VideoPlay /></el-icon>
              测试运行
            </el-button>
          </div>
        </div>
        
        <div class="editor-content">
          <div class="node-palette">
            <h4>节点库</h4>
            <div class="node-categories">
              <div class="node-category">
                <h5>基础节点</h5>
                <div 
                  v-for="nodeType in basicNodes"
                  :key="nodeType.type"
                  class="node-item"
                  draggable="true"
                  @dragstart="handleNodeDragStart($event, nodeType)"
                >
                  <el-icon><component :is="nodeType.icon" /></el-icon>
                  <span>{{ nodeType.name }}</span>
                </div>
              </div>
              
              <div class="node-category">
                <h5>AI节点</h5>
                <div 
                  v-for="nodeType in aiNodes"
                  :key="nodeType.type"
                  class="node-item"
                  draggable="true"
                  @dragstart="handleNodeDragStart($event, nodeType)"
                >
                  <el-icon><component :is="nodeType.icon" /></el-icon>
                  <span>{{ nodeType.name }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="canvas-container">
            <div 
              class="workflow-canvas"
              @drop="handleCanvasDrop"
              @dragover="handleCanvasDragOver"
            >
              <div 
                v-for="node in canvasNodes"
                :key="node.id"
                class="canvas-node"
                :class="node.type"
                :style="{ left: node.x + 'px', top: node.y + 'px' }"
                @click="selectNode(node)"
              >
                <div class="node-header">
                  <el-icon><component :is="getNodeIcon(node.type)" /></el-icon>
                  <span>{{ node.name }}</span>
                </div>
                <div class="node-ports">
                  <div class="input-port"></div>
                  <div class="output-port"></div>
                </div>
              </div>
              
              <!-- 连接线 -->
              <svg class="connections-layer">
                <path 
                  v-for="connection in connections"
                  :key="connection.id"
                  :d="connection.path"
                  stroke="#409eff"
                  stroke-width="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>
          
          <div class="properties-panel" v-if="selectedNode">
            <h4>节点属性</h4>
            <el-form :model="selectedNode" label-width="80px">
              <el-form-item label="名称">
                <el-input v-model="selectedNode.name" />
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="selectedNode.description" type="textarea" :rows="3" />
              </el-form-item>
              
              <!-- 根据节点类型显示不同的配置项 -->
              <template v-if="selectedNode.type === 'ai_chat'">
                <el-form-item label="AI模型">
                  <el-select v-model="selectedNode.config.model" style="width: 100%">
                    <el-option label="GPT-4" value="gpt-4" />
                    <el-option label="Claude 3" value="claude-3" />
                    <el-option label="Gemini Pro" value="gemini-pro" />
                  </el-select>
                </el-form-item>
                <el-form-item label="提示词">
                  <el-input v-model="selectedNode.config.prompt" type="textarea" :rows="4" />
                </el-form-item>
              </template>
              
              <template v-if="selectedNode.type === 'condition'">
                <el-form-item label="条件表达式">
                  <el-input v-model="selectedNode.config.condition" />
                </el-form-item>
              </template>
            </el-form>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 执行日志对话框 -->
    <el-dialog v-model="logsDialogVisible" title="执行日志" width="800px">
      <div class="logs-content">
        <div class="logs-header">
          <el-select v-model="selectedExecution" placeholder="选择执行记录">
            <el-option 
              v-for="execution in executionLogs"
              :key="execution.id"
              :label="`${execution.startTime} - ${execution.status}`"
              :value="execution.id"
            />
          </el-select>
        </div>
        
        <div class="logs-timeline" v-if="selectedExecutionData">
          <el-timeline>
            <el-timeline-item 
              v-for="log in selectedExecutionData.logs"
              :key="log.id"
              :timestamp="log.timestamp"
              :type="getLogType(log.level)"
            >
              <div class="log-item">
                <div class="log-header">
                  <span class="log-node">{{ log.nodeName }}</span>
                  <el-tag :type="getLogType(log.level)" size="small">
                    {{ log.level }}
                  </el-tag>
                </div>
                <div class="log-message">{{ log.message }}</div>
                <div v-if="log.data" class="log-data">
                  <pre>{{ JSON.stringify(log.data, null, 2) }}</pre>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式数据
const workflows = ref([
  {
    id: 1,
    name: '代码审查工作流',
    description: '自动化代码审查和质量检查流程',
    status: '运行中',
    nodeCount: 6,
    executions: 45,
    successRate: 92,
    nodes: [
      { id: 1, type: 'start', name: '开始' },
      { id: 2, type: 'ai_chat', name: 'AI代码审查' },
      { id: 3, type: 'condition', name: '质量检查' },
      { id: 4, type: 'notification', name: '发送通知' },
      { id: 5, type: 'end', name: '结束' }
    ]
  },
  {
    id: 2,
    name: '内容生成工作流',
    description: '自动生成和发布内容的完整流程',
    status: '暂停',
    nodeCount: 8,
    executions: 23,
    successRate: 87,
    nodes: [
      { id: 1, type: 'start', name: '开始' },
      { id: 2, type: 'ai_chat', name: '内容生成' },
      { id: 3, type: 'ai_chat', name: '内容优化' },
      { id: 4, type: 'approval', name: '人工审核' },
      { id: 5, type: 'publish', name: '发布内容' },
      { id: 6, type: 'end', name: '结束' }
    ]
  }
])

const editorDialogVisible = ref(false)
const logsDialogVisible = ref(false)
const editingWorkflow = ref(null)
const selectedNode = ref(null)
const saving = ref(false)

const workflowForm = reactive({
  name: '',
  description: ''
})

const canvasNodes = ref([])
const connections = ref([])

const basicNodes = ref([
  { type: 'start', name: '开始', icon: 'VideoPlay' },
  { type: 'end', name: '结束', icon: 'VideoPause' },
  { type: 'condition', name: '条件判断', icon: 'Operation' },
  { type: 'delay', name: '延时', icon: 'Timer' },
  { type: 'notification', name: '通知', icon: 'Bell' }
])

const aiNodes = ref([
  { type: 'ai_chat', name: 'AI对话', icon: 'ChatDotRound' },
  { type: 'ai_image', name: 'AI图像', icon: 'Picture' },
  { type: 'ai_code', name: 'AI编程', icon: 'Document' },
  { type: 'ai_analysis', name: 'AI分析', icon: 'DataAnalysis' }
])

const executionLogs = ref([
  {
    id: 1,
    startTime: '2024-01-15 10:30:00',
    status: '成功',
    logs: [
      {
        id: 1,
        timestamp: '10:30:01',
        level: 'info',
        nodeName: '开始',
        message: '工作流开始执行'
      },
      {
        id: 2,
        timestamp: '10:30:05',
        level: 'info',
        nodeName: 'AI代码审查',
        message: '正在分析代码质量',
        data: { codeLines: 156, issues: 3 }
      },
      {
        id: 3,
        timestamp: '10:30:12',
        level: 'success',
        nodeName: 'AI代码审查',
        message: '代码审查完成'
      }
    ]
  }
])

const selectedExecution = ref(null)

// 计算属性
const selectedExecutionData = computed(() => {
  return executionLogs.value.find(log => log.id === selectedExecution.value)
})

// 方法
const createWorkflow = () => {
  editingWorkflow.value = null
  workflowForm.name = ''
  workflowForm.description = ''
  canvasNodes.value = []
  connections.value = []
  selectedNode.value = null
  editorDialogVisible.value = true
}

const editWorkflow = (workflow: any) => {
  editingWorkflow.value = workflow
  workflowForm.name = workflow.name
  workflowForm.description = workflow.description
  
  // 加载工作流节点到画布
  canvasNodes.value = workflow.nodes.map((node, index) => ({
    ...node,
    x: 100 + (index % 3) * 200,
    y: 100 + Math.floor(index / 3) * 150,
    config: {}
  }))
  
  editorDialogVisible.value = true
}

const runWorkflow = async (workflow: any) => {
  ElMessage.info(`正在运行工作流: ${workflow.name}`)
  
  try {
    // 模拟工作流执行
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('工作流执行完成')
    
    // 更新执行次数
    workflow.executions++
  } catch (error) {
    ElMessage.error('工作流执行失败')
  }
}

const viewLogs = (workflow: any) => {
  selectedExecution.value = executionLogs.value[0]?.id
  logsDialogVisible.value = true
}

const handleWorkflowAction = ({ action, workflow }: any) => {
  switch (action) {
    case 'clone':
      ElMessage.info('克隆功能开发中...')
      break
    case 'export':
      exportWorkflow(workflow)
      break
    case 'delete':
      deleteWorkflow(workflow)
      break
  }
}

const deleteWorkflow = async (workflow: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除工作流 "${workflow.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const index = workflows.value.findIndex(w => w.id === workflow.id)
    if (index > -1) {
      workflows.value.splice(index, 1)
      ElMessage.success('工作流删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

const exportWorkflow = (workflow: any) => {
  const data = JSON.stringify(workflow, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${workflow.name}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('工作流导出成功')
}

const saveWorkflow = async () => {
  if (!workflowForm.name) {
    ElMessage.error('请输入工作流名称')
    return
  }
  
  saving.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingWorkflow.value) {
      // 更新现有工作流
      const index = workflows.value.findIndex(w => w.id === editingWorkflow.value.id)
      if (index > -1) {
        workflows.value[index] = {
          ...workflows.value[index],
          ...workflowForm,
          nodes: canvasNodes.value,
          nodeCount: canvasNodes.value.length
        }
      }
      ElMessage.success('工作流更新成功')
    } else {
      // 创建新工作流
      const newWorkflow = {
        id: Date.now(),
        ...workflowForm,
        status: '草稿',
        nodeCount: canvasNodes.value.length,
        executions: 0,
        successRate: 0,
        nodes: canvasNodes.value
      }
      workflows.value.unshift(newWorkflow)
      ElMessage.success('工作流创建成功')
    }
    
    editorDialogVisible.value = false
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    saving.value = false
  }
}

const testWorkflow = () => {
  ElMessage.info('测试运行功能开发中...')
}

const handleNodeDragStart = (event: DragEvent, nodeType: any) => {
  event.dataTransfer?.setData('application/json', JSON.stringify(nodeType))
}

const handleCanvasDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleCanvasDrop = (event: DragEvent) => {
  event.preventDefault()
  const nodeTypeData = event.dataTransfer?.getData('application/json')
  if (nodeTypeData) {
    const nodeType = JSON.parse(nodeTypeData)
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const newNode = {
      id: Date.now(),
      ...nodeType,
      x: x - 50, // 居中偏移
      y: y - 25,
      config: {}
    }
    
    canvasNodes.value.push(newNode)
  }
}

const selectNode = (node: any) => {
  selectedNode.value = node
}

const getStatusColor = (status: string) => {
  const colors = {
    '运行中': 'success',
    '暂停': 'warning',
    '草稿': 'info',
    '错误': 'danger'
  }
  return colors[status] || 'default'
}

const getNodeIcon = (type: string) => {
  const icons = {
    start: 'VideoPlay',
    end: 'VideoPause',
    ai_chat: 'ChatDotRound',
    ai_image: 'Picture',
    ai_code: 'Document',
    ai_analysis: 'DataAnalysis',
    condition: 'Operation',
    delay: 'Timer',
    notification: 'Bell',
    approval: 'User',
    publish: 'Upload'
  }
  return icons[type] || 'Box'
}

const getLogType = (level: string) => {
  const types = {
    info: 'primary',
    success: 'success',
    warning: 'warning',
    error: 'danger'
  }
  return types[level] || 'default'
}

onMounted(() => {
  console.log('工作流管理页面已加载')
})
</script>

<style scoped lang="scss">
.workflows-management {
  padding: 20px;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      color: #303133;
    }
  }
  
  .workflows-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
    
    .workflow-card {
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      padding: 20px;
      transition: all 0.3s;
      
      &:hover {
        border-color: #409eff;
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
      }
      
      .workflow-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
        
        .workflow-info {
          flex: 1;
          
          h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
          }
          
          .workflow-description {
            margin: 0;
            font-size: 14px;
            color: #606266;
            line-height: 1.4;
          }
        }
      }
      
      .workflow-content {
        margin-bottom: 16px;
        
        .workflow-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
          
          .stat-item {
            text-align: center;
            
            .label {
              display: block;
              font-size: 12px;
              color: #909399;
              margin-bottom: 4px;
            }
            
            .value {
              display: block;
              font-size: 16px;
              font-weight: 600;
              color: #303133;
            }
          }
        }
        
        .workflow-preview {
          .nodes-preview {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .node-preview {
              width: 32px;
              height: 32px;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              
              &.start { background-color: #67c23a; color: white; }
              &.end { background-color: #f56c6c; color: white; }
              &.ai_chat { background-color: #409eff; color: white; }
              &.condition { background-color: #e6a23c; color: white; }
              &.notification { background-color: #909399; color: white; }
            }
            
            .more-nodes {
              font-size: 12px;
              color: #909399;
            }
          }
        }
      }
      
      .workflow-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }
    }
  }
}

:global(.workflow-editor-dialog) {
  .el-dialog__body {
    padding: 0;
  }
}

.workflow-editor {
  height: 70vh;
  display: flex;
  flex-direction: column;
  
  .editor-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e4e7ed;
    
    .toolbar-left {
      display: flex;
      align-items: center;
    }
    
    .toolbar-right {
      display: flex;
      gap: 8px;
    }
  }
  
  .editor-content {
    flex: 1;
    display: flex;
    
    .node-palette {
      width: 200px;
      border-right: 1px solid #e4e7ed;
      padding: 16px;
      overflow-y: auto;
      
      h4 {
        margin: 0 0 16px 0;
        font-size: 14px;
        color: #303133;
      }
      
      .node-category {
        margin-bottom: 20px;
        
        h5 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #909399;
          text-transform: uppercase;
        }
        
        .node-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: 4px;
          cursor: grab;
          transition: all 0.3s;
          
          &:hover {
            background-color: #f0f9ff;
          }
          
          .el-icon {
            font-size: 16px;
            color: #409eff;
          }
          
          span {
            font-size: 12px;
            color: #606266;
          }
        }
      }
    }
    
    .canvas-container {
      flex: 1;
      position: relative;
      overflow: hidden;
      
      .workflow-canvas {
        width: 100%;
        height: 100%;
        position: relative;
        background-image: 
          radial-gradient(circle, #e4e7ed 1px, transparent 1px);
        background-size: 20px 20px;
        
        .canvas-node {
          position: absolute;
          width: 120px;
          height: 60px;
          border: 2px solid #409eff;
          border-radius: 8px;
          background-color: white;
          cursor: pointer;
          transition: all 0.3s;
          
          &:hover {
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
          }
          
          .node-header {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px;
            font-size: 12px;
            
            .el-icon {
              color: #409eff;
            }
          }
          
          .node-ports {
            position: absolute;
            
            .input-port, .output-port {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: #409eff;
              position: absolute;
            }
            
            .input-port {
              left: -4px;
              top: 50%;
              transform: translateY(-50%);
            }
            
            .output-port {
              right: -4px;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
        
        .connections-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      }
    }
    
    .properties-panel {
      width: 300px;
      border-left: 1px solid #e4e7ed;
      padding: 16px;
      overflow-y: auto;
      
      h4 {
        margin: 0 0 16px 0;
        font-size: 14px;
        color: #303133;
      }
    }
  }
}

.logs-content {
  .logs-header {
    margin-bottom: 20px;
  }
  
  .log-item {
    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      .log-node {
        font-weight: 600;
        color: #303133;
      }
    }
    
    .log-message {
      margin-bottom: 8px;
      color: #606266;
    }
    
    .log-data {
      background-color: #f5f7fa;
      padding: 8px;
      border-radius: 4px;
      
      pre {
        margin: 0;
        font-size: 12px;
        color: #606266;
      }
    }
  }
}
</style>