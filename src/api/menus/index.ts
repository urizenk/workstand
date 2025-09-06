import request from '@/utils/request'

enum API {
  menus = '/admin/menus',
}

//暴露请求的方法
export const reqMenus = (userid) => {
  return request({
    method: 'GET',
    url: API.menus + '/' + userid,
  })
}
