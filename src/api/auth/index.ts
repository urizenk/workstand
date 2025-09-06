import request from '@/utils/request'

enum API {
  oauth_token = '/oauth/token',
  refresh_token = '/refreshToken',
  auth_user = '/admin/user/info',
}

//暴露请求的方法
export const reqAuthUser = (id: string) => {
  return request({
    method: 'Get',
    url: API.auth_user + '/' + id,
  })
}
