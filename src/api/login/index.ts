import request from '@/utils/request'

enum API {
  login = '/admin/login',
}

//暴露请求的方法
export const reqLogin = (username: string, password: string) => {
  return request({
    method: 'POST',
    url: API.login,
    params: {
      username,
      password,
    },
  })
}
