import { defineStore } from 'pinia'
import { reqBankCardInfo } from '@/api/bankcard/index'
export const useBankCardStore = defineStore('BankCard', {
  state: () => {
    return {
      accountName: '',
      bankName: '',
      cardnNo: '',
    }
  },
  actions: {
    async bankCardInfo() {
      const res = await reqBankCardInfo()
      console.log(res)
      this.accountName = res.data.accountName
      this.bankName = res.data.bankName
      this.cardnNo = res.data.cardnNo
    },
  },
  getters: {},
})
