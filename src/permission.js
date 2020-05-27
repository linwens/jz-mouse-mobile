import router from './router'
import store from './store'
import { Toast } from 'vant'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  let hasToken = getToken()
  // 更新token后，清理缓存
  if (to.query.token && to.query.token !== hasToken) {
    hasToken = null
    store.dispatch('user/resetToken') // 清空用户缓存
  }

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.info.name
      if (hasGetUserInfo) {
        next()
      } else {
        // remove token and go to login page to re-login
        await store.dispatch('user/resetToken')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    /* has no token*/
    if (to.query.token) {
      console.log('有token值', to, to.query.token)
      store.dispatch('user/urlSetToken', to.query.token).then((res) => {
        console.log('存了token值', getToken())
        store.dispatch('user/tokenLogin').then(res => {
          console.log('请求获取了用户信息')
          next('/')
          NProgress.done()
        }).catch(() => {
          Toast.fail('获取用户信息失败，请关闭后重试')
        })
      })
      return
    }

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
