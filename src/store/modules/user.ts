import { defineStore } from 'pinia'
import { reqLogin } from '@/api/login/index'
import { reqAuthUser } from '@/api/auth/index'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { routes } from '@/router/index'
import type { UserState } from './types/type'
const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menus: [],
      authorities: [],
      id: 0,
      username: '',
      menuRoutes: routes,
    }
  },
  actions: {
    async login(username, password) {
      const res = await reqLogin(username, password)
      console.log(res)
      this.token = res.token.replace('bearer ', '')
      this.menus = res.menus
      this.authorities = res.authorities
      SET_TOKEN(this.token)
    },

    async userInfo(id) {
      const res = await reqAuthUser(id)
      this.id = res.data.id
      this.username = res.data.username
    },
    userLogout() {
      this.token = ''
      this.username = ''
      this.menus = []
      this.id = 0
      REMOVE_TOKEN()
    },
  },
  getters: {},
})

export default useUserStore
