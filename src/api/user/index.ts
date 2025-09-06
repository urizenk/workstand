import request from '@/utils/request'

enum API {
  role_info = '/admin/roles/test',
}

//暴露请求的方法
export const reqRoleInfo = (id: number) => {
  return request({
    method: 'Get',
    url: API.role_info,
    params: {
      id,
    },
  })
}
