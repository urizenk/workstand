<template>
  <div class="">
    角色管理
    <p>{{ userStore.id }}</p>
    <p>{{ userStore.username }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'

import useUserStore from '@/store/modules/user'

let userStore = useUserStore()
</script>
<style scoped lang="scss"></style>
