import SvgIcon from './SvgIcon/index.vue'
import type { App, Component } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const components: { [name: string]: Component } = { SvgIcon }
export default {
  install(app: App) {
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key])
    }),
      //将element-plus的图标注册为全局组件
      Object.keys(ElementPlusIconsVue).forEach((key: string) => {
        app.component(key, ElementPlusIconsVue[key])
      })
  },
}
