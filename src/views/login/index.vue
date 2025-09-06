<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          label-position="top"
          :rules="rules"
          ref="loginFormRef"
        >
          <h1>欢迎登录</h1>
          <h2>欢迎来到后台管理系统</h2>
          <el-form-item label="用户名" prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              :prefix-icon="Lock"
              placeholder="用户名密码"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'
const userStore = useUserStore()
//定义变量控制按钮加载效果
let loading = ref(false)
let loginForm = reactive({
  username: 'admin',
  password: '123456',
})
const validatePassword = (rule: any, value, callback) => {
  if (value.length < 5) {
    callback(new Error('密码长度需要大于5位'))
  } else {
    callback()
  }
}
//定义表单验证规则
const rules = {
  username: [
    {
      required: true,
      message: '请输入有效用户名',
      trigger: 'blur',
    },
    {
      min: 3,
      max: 10,
      message: '长度在 3 到 10 个字符',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入有效密码',
      trigger: 'change',
      validator: validatePassword,
    },
    {
      min: 6,
      max: 20,
      message: '长度在 6 到 20 个字符',
      trigger: 'blur',
    },
  ],
}

//表单验证通过后的回调
let loginFormRef = ref()
let $route = useRoute()
let $router = useRouter()
const login = async () => {
  try {
    //当点击登录按钮时，将loading设置为true
    loading.value = true
    await userStore.login(loginForm.username, loginForm.password)
    //当登录成功后，将loading设置为false
    loading.value = false
    // eslint-disable-next-line no-undef

    //当登录成功后，如果有query参数，跳转到query参数指定的页面，否则跳转到首页
    if ($route.query.redirect) {
      $router.push({ path: $route.query.redirect as string })
    } else {
      $router.push({ path: '/' })
    }

    //当登录成功后，弹出提示框
    ElNotification({
      title: 'Hi,' + getTime() + '!',
      message: '欢迎回来',
      type: 'success',
    })
  } catch (error) {
    //当登录失败后，提示消息
    loading.value = false
    ElNotification({
      title: '登录失败',
      message: error.message,
      type: 'error',
    })
  }
}
</script>
<style scoped lang="scss">
.login_container {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/images/login_bg.jpg') no-repeat;
  background-size: cover;

  h1 {
    font-size: 30px;
    color: #fff;
    margin-top: 20vh;
    margin-bottom: 3vh;
  }

  h2 {
    font-size: 30px;
    color: #fff;
    margin-bottom: 3vh;
  }

  .login_form {
    color: #000;
    font-weight: 600;
    position: relative;
    width: 80%;
    background-color: rgb(96, 106, 160);
    border-radius: 20px;

    //垂直居中
    .login_btn {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>
