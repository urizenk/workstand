//获取系统时间，来判断当前时间是上午还是下午
export const getTime = () => {
  const date = new Date()
  const hours = date.getHours()
  if (hours < 12) {
    return '上午好'
  } else if (hours < 18) {
    return '下午好'
  } else {
    return '晚上好'
  }
}
