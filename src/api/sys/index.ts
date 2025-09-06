import request from '@/utils/request'

enum API {
  menus = '/admin/sysUserLog',
}

//暴露请求的方法
export const reqSysLog = () => {
  return request({
    method: 'GET',
    url: API.menus,
  })
}
