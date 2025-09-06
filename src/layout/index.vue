<template>
  <div class="layout_container">
    <div
      class="layout_sider"
      :class="{ fold: settingStore.isFold ? true : false }"
    >
      <logo></logo>
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <ElScrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          background-color="rgb(23, 21, 23)"
          text-color="white"
          active-text-color="#00b386"
          :default-active="$route.path"
          :collapse="settingStore.isFold"
        >
          <menus :menuList="userStore.menuRoutes"></menus>
        </el-menu>
      </ElScrollbar>
    </div>
    <div
      class="layout_tabbar"
      :class="{ fold: settingStore.isFold ? true : false }"
    >
      <Tabbar></Tabbar>
    </div>
    <div
      class="layout_main"
      :class="{ fold: settingStore.isFold ? true : false }"
    >
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from './logo/index.vue'
import Main from './main/index.vue'
import useUserStore from '@/store/modules/user'
import menus from './menus/index.vue'
import Tabbar from './tabbar/index.vue'
import { useRoute } from 'vue-router'
import { useSettingStore } from '@/store/modules/setting'
let settingStore = useSettingStore()
let $route = useRoute()

let userStore = useUserStore()
</script>
<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_sider {
    width: $base-menu-width;
    height: 100%;
    background: $base-menu-bgcolor;
    transition: all 0.3s;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-logo-height);

      .el-menu {
        border-right: none;
      }

      .scrollbar-item {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-size: 20px;
      }
    }
    &.fold {
      width: $base-menu-width-min;
    }
  }

  .layout_tabbar {
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    background: $base-tabbar-bgcolor;
    position: fixed;
    top: 0;
    left: $base-menu-width;

    &.fold {
      width: calc(100vw - $base-menu-width-min);
      left: $base-menu-width-min;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background: $base-main-bgcolor;
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    &.fold {
      width: calc(100vw - $base-menu-width-min);
      left: $base-menu-width-min;
    }
  }
}
</style>
