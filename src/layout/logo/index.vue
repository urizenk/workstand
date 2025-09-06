<template>
  <div class="logo" v-if="setting.logoHidden">
    <img alt="project logo" :src="setting.logo" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'
import setting from '@/setting'
</script>
<style scoped lang="scss">
.logo {
  display: flex;
  width: 100%;
  height: $base-logo-height;
  color: #fff;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    margin: 0 10px;
  }
  p {
    font-size: $base-logo-font-size;
  }
}
</style>
