import { defineStore } from 'pinia'
export const useSettingStore = defineStore('Setting', {
  state: () => {
    return {
      isFold: false, // 是否折叠菜单
      refsh: false, // 是否刷新页面
    }
  },
  actions: {},
  getters: {},
})
