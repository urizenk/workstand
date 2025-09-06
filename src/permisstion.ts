//路由鉴权
// import nprogress from 'nprogress'
// import 'nprogress/nprogress.css'
// import router from './router'
// import pinia from './store'
// import useUserStore from './store/modules/user'
// import { ElNotification } from 'element-plus'

// nprogress.configure({ showSpinner: false })
// const userStore = useUserStore(pinia)
// router.beforeEach(async (to, from, next) => {
//   document.title = to.meta.title as string
//   nprogress.start()

//   const token = userStore.token
//   const username = userStore.username
//   if (token) {
//     if (to.path == '/login') {
//       next({ path: '/' })
//     } else {
//       if (username) {
//         next()
//       } else {
//         try {
//           await userStore.userInfo('1010101010101010101')
//         } catch (error) {
//           userStore.userLogout()
//           ElNotification({
//             title: '错误',
//             message: '用户信息获取失败',
//             type: 'error',
//           })
//           next({ path: '/login', query: { redirect: to.path } })
//         }
//       }
//     }
//   } else {
//     if (to.path === '/login') {
//       next()
//     } else {
//       next({ path: '/login', query: { redirect: to.path } })
//     }
//   }

//   next()
// })

// router.afterEach((to, from) => {
//   nprogress.done()
// })
