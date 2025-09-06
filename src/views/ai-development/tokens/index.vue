<template>
  <div class="tokens-management">
    <div class="page-header">
      <h2>API Token管理</h2>
      <el-button type="primary" @click="addToken">
        <el-icon><Plus /></el-icon>
        添加Token
      </el-button>
    </div>

    <!-- Token列表 -->
    <el-card>
      <el-table :data="tokens" style="width: 100%">
        <el-table-column prop="name" label="名称" min-width="150" />
        <el-table-column prop="provider" label="服务商" width="120">
          <template #default="{ row }">
            <el-tag :type="getProviderColor(row.provider)">
              {{ row.provider }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="model" label="默认模型" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'danger'" size="small">
              {{ row.isActive ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="usage" label="使用统计" width="150">
          <template #default="{ row }">
            <div class="usage-info">
              <div>请求: {{ row.usage.requests }}</div>
              <div>Token: {{ row.usage.tokens }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="lastUsed" label="最后使用" width="120" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="testToken(row)">
              测试
            </el-button>
            <el-button size="small" @click="editToken(row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="deleteToken(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑Token对话框 -->
    <el-dialog 
      v-model="tokenDialogVisible" 
      :title="editingToken ? '编辑Token' : '添加Token'" 
      width="600px"
    >
      <el-form :model="tokenForm" :rules="tokenRules" ref="tokenFormRef" label-width="120px">
        <el-form-item label="Token名称" prop="name">
          <el-input v-model="tokenForm.name" placeholder="为Token起个名字" />
        </el-form-item>
        
        <el-form-item label="服务商" prop="provider">
          <el-select v-model="tokenForm.provider" placeholder="选择AI服务商" style="width: 100%">
            <el-option label="OpenAI" value="openai" />
            <el-option label="Claude" value="claude" />
            <el-option label="Google Gemini" value="gemini" />
            <el-option label="通义千问" value="qwen" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="API Token" prop="token">
          <el-input 
            v-model="tokenForm.token" 
            type="password" 
            placeholder="输入API Token"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="API端点" v-if="tokenForm.provider === 'custom'">
          <el-input v-model="tokenForm.endpoint" placeholder="自定义API端点URL" />
        </el-form-item>
        
        <el-form-item label="默认模型">
          <el-select v-model="tokenForm.model" placeholder="选择默认模型" style="width: 100%">
            <el-option 
              v-for="model in getAvailableModels(tokenForm.provider)"
              :key="model.value"
              :label="model.label"
              :value="model.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="最大Token数">
          <el-input-number 
            v-model="tokenForm.maxTokens" 
            :min="1" 
            :max="32000"
            placeholder="最大Token数限制"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="描述">
          <el-input 
            v-model="tokenForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="Token的用途描述"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="tokenDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveToken" :loading="saving">
          {{ editingToken ? '更新' : '添加' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式数据
const tokens = ref([
  {
    id: 1,
    name: 'OpenAI GPT-4',
    provider: 'openai',
    model: 'gpt-4',
    isActive: true,
    usage: { requests: 1250, tokens: 45000 },
    lastUsed: '2小时前'
  },
  {
    id: 2,
    name: 'Claude 3 Sonnet',
    provider: 'claude',
    model: 'claude-3-sonnet',
    isActive: true,
    usage: { requests: 890, tokens: 32000 },
    lastUsed: '1天前'
  },
  {
    id: 3,
    name: '通义千问',
    provider: 'qwen',
    model: 'qwen-max',
    isActive: false,
    usage: { requests: 156, tokens: 8900 },
    lastUsed: '1周前'
  }
])

const tokenDialogVisible = ref(false)
const editingToken = ref(null)
const saving = ref(false)

const tokenForm = reactive({
  name: '',
  provider: '',
  token: '',
  endpoint: '',
  model: '',
  maxTokens: 4000,
  description: ''
})

const tokenRules = {
  name: [
    { required: true, message: '请输入Token名称', trigger: 'blur' }
  ],
  provider: [
    { required: true, message: '请选择服务商', trigger: 'change' }
  ],
  token: [
    { required: true, message: '请输入API Token', trigger: 'blur' }
  ]
}

// 方法
const addToken = () => {
  editingToken.value = null
  resetTokenForm()
  tokenDialogVisible.value = true
}

const editToken = (token: any) => {
  editingToken.value = token
  Object.assign(tokenForm, token)
  tokenDialogVisible.value = true
}

const deleteToken = async (token: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除Token "${token.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const index = tokens.value.findIndex(t => t.id === token.id)
    if (index > -1) {
      tokens.value.splice(index, 1)
      ElMessage.success('Token删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

const testToken = async (token: any) => {
  ElMessage.info('正在测试Token连接...')
  
  try {
    // 模拟测试API连接
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success(`Token "${token.name}" 连接正常`)
  } catch (error) {
    ElMessage.error(`Token "${token.name}" 连接失败`)
  }
}

const saveToken = async () => {
  saving.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingToken.value) {
      // 更新现有Token
      const index = tokens.value.findIndex(t => t.id === editingToken.value.id)
      if (index > -1) {
        tokens.value[index] = { ...tokens.value[index], ...tokenForm }
      }
      ElMessage.success('Token更新成功')
    } else {
      // 添加新Token
      const newToken = {
        id: Date.now(),
        ...tokenForm,
        isActive: true,
        usage: { requests: 0, tokens: 0 },
        lastUsed: '从未使用'
      }
      tokens.value.unshift(newToken)
      ElMessage.success('Token添加成功')
    }
    
    tokenDialogVisible.value = false
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    saving.value = false
  }
}

const resetTokenForm = () => {
  Object.keys(tokenForm).forEach(key => {
    tokenForm[key] = typeof tokenForm[key] === 'number' ? 4000 : ''
  })
}

const getProviderColor = (provider: string) => {
  const colors = {
    openai: 'success',
    claude: 'primary',
    gemini: 'warning',
    qwen: 'info',
    custom: 'default'
  }
  return colors[provider] || 'default'
}

const getAvailableModels = (provider: string) => {
  const models = {
    openai: [
      { label: 'GPT-4', value: 'gpt-4' },
      { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
      { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' }
    ],
    claude: [
      { label: 'Claude 3 Opus', value: 'claude-3-opus' },
      { label: 'Claude 3 Sonnet', value: 'claude-3-sonnet' },
      { label: 'Claude 3 Haiku', value: 'claude-3-haiku' }
    ],
    gemini: [
      { label: 'Gemini Pro', value: 'gemini-pro' },
      { label: 'Gemini Pro Vision', value: 'gemini-pro-vision' }
    ],
    qwen: [
      { label: '通义千问 Max', value: 'qwen-max' },
      { label: '通义千问 Plus', value: 'qwen-plus' },
      { label: '通义千问 Turbo', value: 'qwen-turbo' }
    ],
    custom: [
      { label: '自定义模型', value: 'custom' }
    ]
  }
  return models[provider] || []
}

onMounted(() => {
  console.log('Token管理页面已加载')
})
</script>

<style scoped lang="scss">
.tokens-management {
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
  
  .usage-info {
    font-size: 12px;
    color: #606266;
    
    div {
      margin-bottom: 2px;
    }
  }
}
</style>