# 虚拟账号管理模块设计文档

## 概述

虚拟账号管理模块为整个工作台提供统一的账号服务，包括接码平台集成、虚拟身份生成、账号注册自动化、风险控制等核心功能。

## 系统架构

### 整体架构
```
┌─────────────────────────────────────────────────────────────┐
│                    前端管理界面                              │
├─────────────────────────────────────────────────────────────┤
│  Vue 3 + Element Plus                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 账号管理     │ │ 平台配置     │ │ 风险监控     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    账号服务层                                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 接码服务     │ │ 注册引擎     │ │ 风险评估     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    数据存储层                                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 账号数据库   │ │ 身份信息     │ │ 使用记录     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 数据模型设计

### 核心实体模型

#### 1. 虚拟账号模型 (VirtualAccount)
```typescript
interface VirtualAccount {
  id: string
  platform: string
  username: string
  email?: string
  phone?: string
  identity: VirtualIdentity
  credentials: AccountCredentials
  status: AccountStatus
  riskLevel: RiskLevel
  usage: AccountUsage
  createdAt: Date
  lastUsed?: Date
}

interface VirtualIdentity {
  firstName: string
  lastName: string
  age: number
  gender: 'male' | 'female'
  location: Location
  avatar?: string
  bio?: string
}

interface AccountCredentials {
  password: string
  tokens: Record<string, string>
  cookies?: string
  sessionData?: Record<string, any>
}

enum AccountStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  EXPIRED = 'expired'
}

enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}
```

#### 2. 接码平台模型 (SmsProvider)
```typescript
interface SmsProvider {
  id: string
  name: string
  apiUrl: string
  apiKey: string
  balance: number
  supportedCountries: string[]
  pricing: PricingInfo
  status: ProviderStatus
  config: ProviderConfig
}

interface PricingInfo {
  pricePerSms: number
  currency: string
  minimumBalance: number
}

enum ProviderStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error'
}
```

## 核心功能设计

### 1. 接码服务集成

#### 接码服务管理器
```typescript
class SmsProviderManager {
  private providers: Map<string, SmsProvider>
  
  async getPhoneNumber(country: string, service: string): Promise<PhoneNumber> {
    const availableProviders = this.getAvailableProviders(country, service)
    
    for (const provider of availableProviders) {
      try {
        const phoneNumber = await this.requestPhoneNumber(provider, country, service)
        if (phoneNumber) {
          return phoneNumber
        }
      } catch (error) {
        console.warn(`Provider ${provider.name} failed:`, error)
        continue
      }
    }
    
    throw new Error('No available phone numbers')
  }
  
  async getSmsCode(phoneNumber: PhoneNumber): Promise<string> {
    const provider = this.providers.get(phoneNumber.providerId)
    return await this.pollForSms(provider, phoneNumber)
  }
}
```

### 2. 虚拟身份生成

#### 身份生成器
```typescript
class IdentityGenerator {
  async generateIdentity(country: string = 'US'): Promise<VirtualIdentity> {
    const gender = this.randomGender()
    const firstName = await this.generateFirstName(gender, country)
    const lastName = await this.generateLastName(country)
    const age = this.randomAge(18, 65)
    
    return {
      firstName,
      lastName,
      age,
      gender,
      location: await this.generateLocation(country),
      avatar: await this.generateAvatar(gender, age),
      bio: await this.generateBio(firstName, age, country)
    }
  }
  
  private async generateAvatar(gender: string, age: number): Promise<string> {
    // 调用AI生成头像或使用头像库
    const prompt = `Professional headshot of a ${age}-year-old ${gender}, realistic, high quality`
    return await this.aiImageService.generate(prompt)
  }
}
```

### 3. 自动注册引擎

#### 注册自动化
```typescript
class RegistrationEngine {
  async registerAccount(
    platform: string,
    identity: VirtualIdentity,
    phoneNumber?: PhoneNumber
  ): Promise<VirtualAccount> {
    
    const browser = await this.launchBrowser()
    const page = await browser.newPage()
    
    try {
      // 1. 导航到注册页面
      await page.goto(this.getPlatformRegistrationUrl(platform))
      
      // 2. 填写注册表单
      await this.fillRegistrationForm(page, identity, phoneNumber)
      
      // 3. 处理验证码
      await this.handleCaptcha(page)
      
      // 4. 处理短信验证
      if (phoneNumber) {
        await this.handleSmsVerification(page, phoneNumber)
      }
      
      // 5. 完成注册
      const credentials = await this.completeRegistration(page)
      
      return this.createVirtualAccount(platform, identity, credentials)
      
    } finally {
      await browser.close()
    }
  }
  
  private async handleSmsVerification(page: Page, phoneNumber: PhoneNumber): Promise<void> {
    // 等待短信验证码输入框出现
    await page.waitForSelector('input[name="sms_code"]')
    
    // 获取短信验证码
    const smsCode = await this.smsProvider.getSmsCode(phoneNumber)
    
    // 输入验证码
    await page.type('input[name="sms_code"]', smsCode)
    await page.click('button[type="submit"]')
  }
}
```

### 4. 风险评估系统

#### 风险评估器
```typescript
class RiskAssessment {
  async assessAccountRisk(account: VirtualAccount): Promise<RiskAssessment> {
    const factors = {
      ageScore: this.calculateAgeScore(account),
      usageScore: this.calculateUsageScore(account.usage),
      platformScore: this.calculatePlatformScore(account.platform),
      behaviorScore: await this.calculateBehaviorScore(account),
      ipScore: await this.calculateIpScore(account)
    }
    
    const totalScore = this.calculateTotalScore(factors)
    const riskLevel = this.determineRiskLevel(totalScore)
    
    return {
      riskLevel,
      score: totalScore,
      factors,
      recommendations: this.generateRecommendations(factors)
    }
  }
  
  private calculateUsageScore(usage: AccountUsage): number {
    const frequency = usage.dailyUsage / 24 // 每小时使用次数
    const intensity = usage.totalRequests / usage.daysActive
    
    // 使用频率过高会增加风险
    if (frequency > 5) return 0.8 // 高风险
    if (frequency > 2) return 0.6 // 中风险
    return 0.2 // 低风险
  }
}
```

## API接口设计

### RESTful API

#### 账号管理API
```typescript
// 账号CRUD
GET    /api/accounts                     # 获取账号列表
POST   /api/accounts                     # 创建账号
GET    /api/accounts/:id                 # 获取账号详情
PUT    /api/accounts/:id                 # 更新账号
DELETE /api/accounts/:id                 # 删除账号

// 账号操作
POST   /api/accounts/register            # 自动注册账号
POST   /api/accounts/:id/refresh-token   # 刷新Token
POST   /api/accounts/:id/check-status    # 检查账号状态
GET    /api/accounts/:id/risk-assessment # 获取风险评估

// 接码服务
GET    /api/sms/providers                # 获取接码平台列表
POST   /api/sms/get-number               # 获取手机号
GET    /api/sms/get-code/:numberId       # 获取验证码
POST   /api/sms/providers/test           # 测试接码平台
```

## 前端组件设计

### 核心组件

#### 1. 账号管理器 (AccountManager.vue)
```vue
<template>
  <div class="account-manager">
    <div class="toolbar">
      <el-button type="primary" @click="createAccount">
        创建账号
      </el-button>
      <el-button @click="batchRegister">
        批量注册
      </el-button>
      <el-select v-model="filterPlatform" placeholder="筛选平台">
        <el-option
          v-for="platform in platforms"
          :key="platform"
          :label="platform"
          :value="platform"
        />
      </el-select>
    </div>
    
    <el-table :data="filteredAccounts" style="width: 100%">
      <el-table-column prop="platform" label="平台" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="riskLevel" label="风险等级">
        <template #default="{ row }">
          <el-tag :type="getRiskType(row.riskLevel)">
            {{ row.riskLevel }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastUsed" label="最后使用" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="useAccount(row)">
            使用
          </el-button>
          <el-button size="small" @click="refreshToken(row)">
            刷新
          </el-button>
          <el-button size="small" type="danger" @click="deleteAccount(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
```

---

*此设计文档将随着开发进展持续更新和完善*