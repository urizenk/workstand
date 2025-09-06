<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <el-icon @click="changeIcon">
        <component :is="settingStore.isFold ? 'Fold' : 'Expand'"></component>
      </el-icon>
      <!-- 面包屑组件 -->
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item
          v-for="(item, index) in $route.matched"
          :key="index"
          v-show="item.meta.title"
          :to="item.path"
        >
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tabbar_right">
      <el-button icon="Refresh" circle="true" @click="fresh"></el-button>
      <el-button
        icon="FullScreen"
        circle="true"
        @click="fullScreen"
      ></el-button>
      <el-button icon="Setting" circle="true"></el-button>

      <img src="../../../public/logo.png" alt="用户头像" />
      <el-dropdown>
        <span class="el-dropdown-link">
          <span>{{ userStore.username }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>用户详情</el-dropdown-item>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'
import { useSettingStore } from '@/store/modules/setting'
import { useRoute, useRouter } from 'vue-router'
import useUserStore from '@/store/modules/user'
let $route = useRoute()
let $router = useRouter()
let userStore = useUserStore()
let settingStore = useSettingStore()
const changeIcon = () => {
  settingStore.isFold = !settingStore.isFold
}

const logout = () => {
  userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

const fresh = () => {
  settingStore.refsh = !settingStore.refsh
}

const fullScreen = () => {
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>
<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(to right, #cdd0da, #a0b2c4, #b5cfea);
  .tabbar_left {
    display: flex;
    align-items: center;
    .el-icon {
      margin: 0 4px;
    }
    .el-breadcrumb-item {
      align-items: center;
      .el-icon {
        margin: 0 4px;
      }
    }
  }
  .tabbar_right {
    display: flex;
    align-items: center;
    .el-button {
      margin: 0 8px;
    }
    img {
      display: flex;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin: 0 8px;
    }
  }
}
</style>
