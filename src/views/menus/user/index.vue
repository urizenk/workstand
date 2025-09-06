<template>
  <div class="">
    <p>用户管理</p>
    <p>用户token</p>
    <div>{{ userStore.token }}</div>
    <p>用户的菜单</p>
    <div v-for="item in userStore.menus" :key="item.id">
      {{ item }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'
import useUserStore from '@/store/modules/user'

let userStore = useUserStore()
</script>
<style scoped lang="scss"></style>
