import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入全局样式
import '@/style/index.scss'
import pinia from './store'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import globalComponent from '@/components/index'
import 'virtual:svg-icons-register'
import router from '@/router/index'
import './permisstion'
import * as THREE from 'three'

const app = createApp(App)
app.config.globalProperties.$THREE = THREE
app.use(globalComponent)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(pinia)
app.use(router)
app.mount('#app')
