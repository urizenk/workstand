<template>
  <div class="projects-management">
    <div class="page-header">
      <h2>项目管理</h2>
      <el-button type="primary" @click="createProject">
        <el-icon><Plus /></el-icon>
        新建项目
      </el-button>
    </div>

    <!-- 项目筛选 -->
    <el-card class="filter-card">
      <el-form :model="filters" inline>
        <el-form-item label="项目类型">
          <el-select v-model="filters.type" placeholder="选择类型" clearable>
            <el-option label="前端项目" value="frontend" />
            <el-option label="后端项目" value="backend" />
            <el-option label="全栈项目" value="fullstack" />
            <el-option label="移动应用" value="mobile" />
            <el-option label="AI/ML项目" value="ai_ml" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="选择状态" clearable>
            <el-option label="开发中" value="developing" />
            <el-option label="测试中" value="testing" />
            <el-option label="已完成" value="completed" />
            <el-option label="暂停" value="paused" />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input 
            v-model="filters.keyword" 
            placeholder="搜索项目名称或描述"
            @keyup.enter="searchProjects"
          >
            <template #append>
              <el-button @click="searchProjects">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 项目列表 -->
    <el-card class="projects-list">
      <div class="view-toggle">
        <el-radio-group v-model="viewMode">
          <el-radio-button label="grid">网格视图</el-radio-button>
          <el-radio-button label="list">列表视图</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="projects-grid">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="project-card"
          @click="openProject(project)"
        >
          <div class="project-header">
            <div class="project-icon">
              <el-icon><component :is="getProjectIcon(project.type)" /></el-icon>
            </div>
            <div class="project-actions">
              <el-dropdown @command="handleProjectAction">
                <el-button circle size="small">
                  <el-icon><MoreFilled /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="{action: 'edit', project}">
                      编辑
                    </el-dropdown-item>
                    <el-dropdown-item :command="{action: 'clone', project}">
                      克隆
                    </el-dropdown-item>
                    <el-dropdown-item :command="{action: 'export', project}">
                      导出
                    </el-dropdown-item>
                    <el-dropdown-item :command="{action: 'delete', project}" divided>
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          
          <div class="project-info">
            <h3>{{ project.name }}</h3>
            <p class="project-description">{{ project.description }}</p>
            
            <div class="project-meta">
              <el-tag :type="getProjectTypeColor(project.type)" size="small">
                {{ project.type }}
              </el-tag>
              <el-tag :type="getStatusColor(project.status)" size="small">
                {{ project.status }}
              </el-tag>
            </div>
            
            <div class="project-stats">
              <span class="stat">
                <el-icon><Document /></el-icon>
                {{ project.fileCount }} 文件
              </span>
              <span class="stat">
                <el-icon><Timer /></el-icon>
                {{ project.lastModified }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <el-table v-else :data="filteredProjects" style="width: 100%">
        <el-table-column prop="name" label="项目名称" min-width="200">
          <template #default="{ row }">
            <div class="project-name-cell">
              <el-icon><component :is="getProjectIcon(row.type)" /></el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getProjectTypeColor(row.type)" size="small">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="lastModified" label="最后修改" width="120" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="openProject(row)">
              打开
            </el-button>
            <el-button size="small" @click="editProject(row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="deleteProject(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建项目对话框 -->
    <el-dialog v-model="createDialogVisible" title="创建新项目" width="600px">
      <el-form :model="newProject" :rules="projectRules" ref="projectForm" label-width="100px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="newProject.name" placeholder="输入项目名称" />
        </el-form-item>
        
        <el-form-item label="项目类型" prop="type">
          <el-select v-model="newProject.type" placeholder="选择项目类型" style="width: 100%">
            <el-option label="前端项目" value="frontend" />
            <el-option label="后端项目" value="backend" />
            <el-option label="全栈项目" value="fullstack" />
            <el-option label="移动应用" value="mobile" />
            <el-option label="AI/ML项目" value="ai_ml" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="项目描述" prop="description">
          <el-input 
            v-model="newProject.description" 
            type="textarea" 
            :rows="3"
            placeholder="描述项目的主要功能和目标"
          />
        </el-form-item>
        
        <el-form-item label="项目路径" prop="path">
          <el-input v-model="newProject.path" placeholder="项目本地路径">
            <template #append>
              <el-button @click="selectPath">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="Git仓库">
          <el-input v-model="newProject.gitRepository" placeholder="Git仓库地址（可选）" />
        </el-form-item>
        
        <el-form-item label="技术栈">
          <el-select 
            v-model="newProject.techStack" 
            multiple 
            placeholder="选择技术栈"
            style="width: 100%"
          >
            <el-option label="Vue.js" value="vue" />
            <el-option label="React" value="react" />
            <el-option label="Angular" value="angular" />
            <el-option label="Node.js" value="nodejs" />
            <el-option label="Python" value="python" />
            <el-option label="Java" value="java" />
            <el-option label="TypeScript" value="typescript" />
            <el-option label="JavaScript" value="javascript" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitProject" :loading="creating">
          创建项目
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 响应式数据
const viewMode = ref('grid')
const createDialogVisible = ref(false)
const creating = ref(false)

const filters = reactive({
  type: '',
  status: '',
  keyword: ''
})

const newProject = reactive({
  name: '',
  type: '',
  description: '',
  path: '',
  gitRepository: '',
  techStack: []
})

const projects = ref([
  {
    id: 1,
    name: 'Vue3管理系统',
    type: 'frontend',
    status: 'developing',
    description: '基于Vue3的现代化管理系统',
    path: '/Users/dev/vue3-admin',
    fileCount: 156,
    lastModified: '2小时前'
  },
  {
    id: 2,
    name: 'Node.js API服务',
    type: 'backend',
    status: 'testing',
    description: 'RESTful API服务，支持微服务架构',
    path: '/Users/dev/nodejs-api',
    fileCount: 89,
    lastModified: '1天前'
  },
  {
    id: 3,
    name: 'React Native App',
    type: 'mobile',
    status: 'completed',
    description: '跨平台移动应用',
    path: '/Users/dev/rn-app',
    fileCount: 234,
    lastModified: '3天前'
  }
])

const projectRules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择项目类型', trigger: 'change' }
  ],
  path: [
    { required: true, message: '请输入项目路径', trigger: 'blur' }
  ]
}

// 计算属性
const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    const matchType = !filters.type || project.type === filters.type
    const matchStatus = !filters.status || project.status === filters.status
    const matchKeyword = !filters.keyword || 
      project.name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      project.description.toLowerCase().includes(filters.keyword.toLowerCase())
    
    return matchType && matchStatus && matchKeyword
  })
})

// 方法
const createProject = () => {
  createDialogVisible.value = true
}

const openProject = (project: any) => {
  router.push(`/ai-development/projects/${project.id}/workspace`)
}

const editProject = (project: any) => {
  // 编辑项目逻辑
  ElMessage.info('编辑功能开发中...')
}

const deleteProject = async (project: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除项目 "${project.name}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 执行删除
    const index = projects.value.findIndex(p => p.id === project.id)
    if (index > -1) {
      projects.value.splice(index, 1)
      ElMessage.success('项目删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

const handleProjectAction = ({ action, project }: any) => {
  switch (action) {
    case 'edit':
      editProject(project)
      break
    case 'clone':
      ElMessage.info('克隆功能开发中...')
      break
    case 'export':
      ElMessage.info('导出功能开发中...')
      break
    case 'delete':
      deleteProject(project)
      break
  }
}

const submitProject = async () => {
  creating.value = true
  
  try {
    // 模拟创建项目
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const project = {
      id: Date.now(),
      ...newProject,
      status: 'developing',
      fileCount: 0,
      lastModified: '刚刚'
    }
    
    projects.value.unshift(project)
    createDialogVisible.value = false
    
    // 重置表单
    Object.keys(newProject).forEach(key => {
      newProject[key] = Array.isArray(newProject[key]) ? [] : ''
    })
    
    ElMessage.success('项目创建成功')
  } catch (error) {
    ElMessage.error('项目创建失败')
  } finally {
    creating.value = false
  }
}

const selectPath = () => {
  // 这里可以集成文件选择器
  ElMessage.info('文件选择器功能开发中...')
}

const searchProjects = () => {
  // 搜索逻辑已在计算属性中实现
}

const getProjectIcon = (type: string) => {
  const icons = {
    frontend: 'Monitor',
    backend: 'Server',
    fullstack: 'Platform',
    mobile: 'Iphone',
    ai_ml: 'Cpu'
  }
  return icons[type] || 'Document'
}

const getProjectTypeColor = (type: string) => {
  const colors = {
    frontend: 'success',
    backend: 'warning',
    fullstack: 'primary',
    mobile: 'info',
    ai_ml: 'danger'
  }
  return colors[type] || 'default'
}

const getStatusColor = (status: string) => {
  const colors = {
    developing: 'warning',
    testing: 'info',
    completed: 'success',
    paused: 'danger'
  }
  return colors[status] || 'default'
}

onMounted(() => {
  console.log('项目管理页面已加载')
})
</script>

<style scoped lang="scss">
.projects-management {
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
  
  .projects-list {
    .view-toggle {
      margin-bottom: 20px;
      text-align: right;
    }
    
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      
      .project-card {
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          border-color: #409eff;
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
        }
        
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          
          .project-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background-color: #f0f9ff;
            display: flex;
            align-items: center;
            justify-content: center;
            
            .el-icon {
              font-size: 20px;
              color: #409eff;
            }
          }
        }
        
        .project-info {
          h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
          }
          
          .project-description {
            margin: 0 0 12px 0;
            font-size: 14px;
            color: #606266;
            line-height: 1.4;
          }
          
          .project-meta {
            margin-bottom: 12px;
            
            .el-tag {
              margin-right: 8px;
            }
          }
          
          .project-stats {
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
      }
    }
    
    .project-name-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .el-icon {
        color: #409eff;
      }
    }
  }
}
</style>