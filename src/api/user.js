import request from '@/utils/request'

/* export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
} */

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

/* export function login(data) {
  return request({
    url: '/token/login',
    method: 'post',
    data
  })
} */

export function loginUser() { // 模拟普通用户
  return request({
    url: '/token/mice/login',
    method: 'get'
  })
}

export function login() { // 模拟admin用户
  return request({
    url: '/token/imitateAdmin/login',
    method: 'get'
  })
}

export function tokenLogin() { // 作为子系统登录
  return request({
    url: '/token/login',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
