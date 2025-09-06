<template>
  <div class="prompts-management">
    <div class="page-header">
      <h2>提示词管理</h2>
      <el-button type="primary" @click="createPrompt">
        <el-icon><Plus /></el-icon>
        新建提示词
      </el-button>
    </div>

    <!-- 筛选和搜索 -->
    <el-card class="filter-card">
      <el-form :model="filters" inline>
        <el-form-item label="分类">
          <el-select v-model="filters.category" placeholder="选择分类" clearable>
            <el-option 
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="filters.tags" multiple placeholder="选择标签" clearable>
            <el-option 
              v-for="tag in allTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input 
            v-model="filters.keyword" 
            placeholder="搜索提示词标题或内容"
            @keyup.enter="searchPrompts"
          >
            <template #append>
              <el-button @click="searchPrompts">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 提示词列表 -->
    <el-card>
      <div class="prompts-grid">
        <div 
          v-for="prompt in filteredPrompts" 
          :key="prompt.id"
          class="prompt-card"
        >
          <div class="prompt-header">
            <h3>{{ prompt.title }}</h3>
            <el-dropdown @command="handlePromptAction">
              <el-button circle size="small">
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="{action: 'use', prompt}">
                    使用
                  </el-dropdown-item>
                  <el-dropdown-item :command="{action: 'edit', prompt}">
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item :command="{action: 'copy', prompt}">
                    复制
                  </el-dropdown-item>
                  <el-dropdown-item :command="{action: 'export', prompt}">
                    导出
                  </el-dropdown-item>
                  <el-dropdown-item :command="{action: 'delete', prompt}" divided>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          
          <div class="prompt-content">
            <p class="prompt-preview">{{ getPromptPreview(prompt.content) }}</p>
            
            <div class="prompt-meta">
              <el-tag size="small">{{ prompt.category }}</el-tag>
              <el-tag 
                v-for="tag in prompt.tags.slice(0, 3)" 
                :key="tag"
                size="small"
                type="info"
              >
                {{ tag }}
              </el-tag>
              <span v-if="prompt.tags.length > 3" class="more-tags">
                +{{ prompt.tags.length - 3 }}
              </span>
            </div>
            
            <div class="prompt-stats">
              <span class="stat">
                <el-icon><View /></el-icon>
                {{ prompt.usage }} 次使用
              </span>
              <span class="stat">
                <el-icon><Timer /></el-icon>
                {{ prompt.lastUsed }}
              </span>
            </div>
          </div>
          
          <div class="prompt-actions">
            <el-button size="small" type="primary" @click="usePrompt(prompt)">
              使用
            </el-button>
            <el-button size="small" @click="editPrompt(prompt)">
              编辑
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 创建/编辑提示词对话框 -->
    <el-dialog 
      v-model="promptDialogVisible" 
      :title="editingPrompt ? '编辑提示词' : '新建提示词'"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form :model="promptForm" :rules="promptRules" ref="promptFormRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="promptForm.title" placeholder="输入提示词标题" />
        </el-form-item>
        
        <el-form-item label="分类" prop="category">
          <el-select v-model="promptForm.category" placeholder="选择分类" style="width: 100%">
            <el-option 
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="标签">
          <el-select 
            v-model="promptForm.tags" 
            multiple 
            filterable 
            allow-create
            placeholder="选择或创建标签"
            style="width: 100%"
          >
            <el-option 
              v-for="tag in allTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="内容" prop="content">
          <el-input 
            v-model="promptForm.content" 
            type="textarea" 
            :rows="10"
            placeholder="输入提示词内容，可以使用 {{变量名}} 来定义变量"
          />
        </el-form-item>
        
        <el-form-item label="变量定义" v-if="promptVariables.length > 0">
          <div class="variables-list">
            <div 
              v-for="variable in promptVariables" 
              :key="variable"
              class="variable-item"
            >
              <el-tag>{{ variable }}</el-tag>
              <el-input 
                v-model="variableDescriptions[variable]"
                placeholder="变量描述"
                size="small"
                style="margin-left: 8px; width: 200px;"
              />
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="描述">
          <el-input 
            v-model="promptForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="描述这个提示词的用途和使用场景"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="promptDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePrompt" :loading="saving">
          {{ editingPrompt ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 使用提示词对话框 -->
    <el-dialog v-model="usePromptDialogVisible" title="使用提示词" width="600px">
      <div v-if="currentPrompt">
        <h4>{{ currentPrompt.title }}</h4>
        <div class="prompt-usage">
          <div v-if="currentPrompt.variables && currentPrompt.variables.length > 0">
            <h5>填写变量值：</h5>
            <el-form label-width="120px">
              <el-form-item 
                v-for="variable in currentPrompt.variables"
                :key="variable.name"
                :label="variable.name"
              >
                <el-input 
                  v-model="variableValues[variable.name]"
                  :placeholder="variable.description || `输入${variable.name}的值`"
                />
              </el-form-item>
            </el-form>
          </div>
          
          <div class="generated-prompt">
            <h5>生成的提示词：</h5>
            <el-input 
              v-model="generatedPrompt"
              type="textarea"
              :rows="8"
              readonly
            />
          </div>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="usePromptDialogVisible = false">取消</el-button>
        <el-button @click="copyPrompt">复制</el-button>
        <el-button type="primary" @click="sendToAI">发送到AI</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式数据
const filters = reactive({
  category: '',
  tags: [],
  keyword: ''
})

const prompts = ref([
  {
    id: 1,
    title: '代码审查助手',
    category: '开发',
    tags: ['代码审查', '质量检查', '最佳实践'],
    content: '请审查以下{{语言}}代码，重点关注：\n1. 代码质量和可读性\n2. 性能优化建议\n3. 安全性问题\n4. 最佳实践建议\n\n代码：\n{{代码内容}}',
    description: '用于代码审查和质量检查的提示词',
    usage: 156,
    lastUsed: '2小时前',
    variables: [
      { name: '语言', description: '编程语言' },
      { name: '代码内容', description: '需要审查的代码' }
    ]
  },
  {
    id: 2,
    title: '技术文档生成',
    category: '文档',
    tags: ['文档', 'API', '技术写作'],
    content: '为以下{{项目类型}}项目生成技术文档：\n\n项目名称：{{项目名称}}\n主要功能：{{功能描述}}\n技术栈：{{技术栈}}\n\n请包含：\n1. 项目概述\n2. 安装和配置\n3. API文档\n4. 使用示例',
    description: '自动生成项目技术文档',
    usage: 89,
    lastUsed: '1天前',
    variables: [
      { name: '项目类型', description: '项目的类型' },
      { name: '项目名称', description: '项目的名称' },
      { name: '功能描述', description: '主要功能描述' },
      { name: '技术栈', description: '使用的技术栈' }
    ]
  },
  {
    id: 3,
    title: '需求分析师',
    category: '产品',
    tags: ['需求分析', '产品设计', '用户故事'],
    content: '作为需求分析师，请分析以下产品需求：\n\n需求描述：{{需求描述}}\n目标用户：{{目标用户}}\n业务目标：{{业务目标}}\n\n请提供：\n1. 详细的需求分析\n2. 用户故事\n3. 功能优先级\n4. 潜在风险和挑战',
    description: '产品需求分析和用户故事生成',
    usage: 67,
    lastUsed: '3天前',
    variables: [
      { name: '需求描述', description: '产品需求的描述' },
      { name: '目标用户', description: '目标用户群体' },
      { name: '业务目标', description: '业务目标' }
    ]
  }
])

const categories = ref(['开发', '文档', '产品', '设计', '测试', '运维', '其他'])
const allTags = ref(['代码审查', '质量检查', '最佳实践', '文档', 'API', '技术写作', '需求分析', '产品设计', '用户故事'])

const promptDialogVisible = ref(false)
const usePromptDialogVisible = ref(false)
const editingPrompt = ref(null)
const currentPrompt = ref(null)
const saving = ref(false)

const promptForm = reactive({
  title: '',
  category: '',
  tags: [],
  content: '',
  description: ''
})

const promptRules = {
  title: [
    { required: true, message: '请输入提示词标题', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入提示词内容', trigger: 'blur' }
  ]
}

const variableDescriptions = reactive({})
const variableValues = reactive({})

// 计算属性
const filteredPrompts = computed(() => {
  return prompts.value.filter(prompt => {
    const matchCategory = !filters.category || prompt.category === filters.category
    const matchTags = filters.tags.length === 0 || 
      filters.tags.some(tag => prompt.tags.includes(tag))
    const matchKeyword = !filters.keyword || 
      prompt.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      prompt.content.toLowerCase().includes(filters.keyword.toLowerCase())
    
    return matchCategory && matchTags && matchKeyword
  })
})

const promptVariables = computed(() => {
  const matches = promptForm.content.match(/\{\{([^}]+)\}\}/g)
  return matches ? matches.map(match => match.slice(2, -2)) : []
})

const generatedPrompt = computed(() => {
  if (!currentPrompt.value) return ''
  
  let result = currentPrompt.value.content
  Object.entries(variableValues).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || `[${key}]`)
  })
  return result
})

// 监听器
watch(() => promptForm.content, () => {
  // 清理不存在的变量描述
  Object.keys(variableDescriptions).forEach(key => {
    if (!promptVariables.value.includes(key)) {
      delete variableDescriptions[key]
    }
  })
})

// 方法
const createPrompt = () => {
  editingPrompt.value = null
  resetPromptForm()
  promptDialogVisible.value = true
}

const editPrompt = (prompt: any) => {
  editingPrompt.value = prompt
  Object.assign(promptForm, prompt)
  
  // 设置变量描述
  if (prompt.variables) {
    prompt.variables.forEach(variable => {
      variableDescriptions[variable.name] = variable.description
    })
  }
  
  promptDialogVisible.value = true
}

const usePrompt = (prompt: any) => {
  currentPrompt.value = prompt
  
  // 重置变量值
  Object.keys(variableValues).forEach(key => {
    delete variableValues[key]
  })
  
  // 初始化变量值
  if (prompt.variables) {
    prompt.variables.forEach(variable => {
      variableValues[variable.name] = ''
    })
  }
  
  usePromptDialogVisible.value = true
}

const savePrompt = async () => {
  saving.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 构建变量数组
    const variables = promptVariables.value.map(name => ({
      name,
      description: variableDescriptions[name] || ''
    }))
    
    if (editingPrompt.value) {
      // 更新现有提示词
      const index = prompts.value.findIndex(p => p.id === editingPrompt.value.id)
      if (index > -1) {
        prompts.value[index] = { 
          ...prompts.value[index], 
          ...promptForm,
          variables
        }
      }
      ElMessage.success('提示词更新成功')
    } else {
      // 添加新提示词
      const newPrompt = {
        id: Date.now(),
        ...promptForm,
        variables,
        usage: 0,
        lastUsed: '从未使用'
      }
      prompts.value.unshift(newPrompt)
      ElMessage.success('提示词创建成功')
    }
    
    promptDialogVisible.value = false
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    saving.value = false
  }
}

const handlePromptAction = ({ action, prompt }: any) => {
  switch (action) {
    case 'use':
      usePrompt(prompt)
      break
    case 'edit':
      editPrompt(prompt)
      break
    case 'copy':
      copyPromptContent(prompt)
      break
    case 'export':
      exportPrompt(prompt)
      break
    case 'delete':
      deletePrompt(prompt)
      break
  }
}

const deletePrompt = async (prompt: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除提示词 "${prompt.title}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const index = prompts.value.findIndex(p => p.id === prompt.id)
    if (index > -1) {
      prompts.value.splice(index, 1)
      ElMessage.success('提示词删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

const copyPromptContent = (prompt: any) => {
  navigator.clipboard.writeText(prompt.content)
  ElMessage.success('提示词内容已复制到剪贴板')
}

const copyPrompt = () => {
  navigator.clipboard.writeText(generatedPrompt.value)
  ElMessage.success('生成的提示词已复制到剪贴板')
}

const sendToAI = () => {
  ElMessage.info('发送到AI功能开发中...')
  usePromptDialogVisible.value = false
}

const exportPrompt = (prompt: any) => {
  const data = JSON.stringify(prompt, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${prompt.title}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('提示词导出成功')
}

const resetPromptForm = () => {
  Object.keys(promptForm).forEach(key => {
    promptForm[key] = Array.isArray(promptForm[key]) ? [] : ''
  })
  Object.keys(variableDescriptions).forEach(key => {
    delete variableDescriptions[key]
  })
}

const getPromptPreview = (content: string) => {
  return content.length > 100 ? content.substring(0, 100) + '...' : content
}

const searchPrompts = () => {
  // 搜索逻辑已在计算属性中实现
}

onMounted(() => {
  console.log('提示词管理页面已加载')
})
</script>

<style scoped lang="scss">
.prompts-management {
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
  
  .filter-card {
    margin-bottom: 20px;
  }
  
  .prompts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    
    .prompt-card {
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      padding: 20px;
      transition: all 0.3s;
      
      &:hover {
        border-color: #409eff;
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
      }
      
      .prompt-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }
      }
      
      .prompt-content {
        margin-bottom: 16px;
        
        .prompt-preview {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #606266;
          line-height: 1.4;
          background-color: #f5f7fa;
          padding: 12px;
          border-radius: 4px;
        }
        
        .prompt-meta {
          margin-bottom: 12px;
          
          .el-tag {
            margin-right: 8px;
            margin-bottom: 4px;
          }
          
          .more-tags {
            font-size: 12px;
            color: #909399;
          }
        }
        
        .prompt-stats {
          display: flex;
          gap: 16px;
          
          .stat {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: #909399;
            
            .el-icon {
              font-size: 14px;
            }
          }
        }
      }
      
      .prompt-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
  
  .variables-list {
    .variable-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
  }
  
  .prompt-usage {
    .generated-prompt {
      margin-top: 20px;
      
      h5 {
        margin-bottom: 8px;
        color: #303133;
      }
    }
  }
}
</style>