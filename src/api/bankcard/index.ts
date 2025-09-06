import request from '@/utils/request'

enum API {
  bank_card_info = '/admin/adminBanks/getLists',
}

//暴露请求的方法
export const reqBankCardInfo = () => {
  return request({
    method: 'GET',
    url: API.bank_card_info,
  })
}
