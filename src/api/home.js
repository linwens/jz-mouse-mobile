import request from '@/utils/request'

export function fetchList(query) { // 首页列表查询
  return request({
    url: '/miceinfo/queryMiceInfoByCondition',
    method: 'get',
    params: query
  })
}

export function getUsers(query) { // 获取负责人列表
  return request({
    url: '/sysuser/operatorList',
    method: 'get',
    params: query
  })
}

export function countMice(action) { // 柱状图
  return request({
    url: `/stat/${action}`,
    method: 'get'
  })
}

export function getItemObj(id) {
  return request({
    url: '/dict/item/' + id,
    method: 'get'
  })
}

export function delItemObj(id) {
  return request({
    url: '/dict/item/' + id,
    method: 'delete'
  })
}

export function putItemObj(obj) {
  return request({
    url: '/dict/item',
    method: 'put',
    data: obj
  })
}

export function addObj(obj) {
  return request({
    url: '/dict/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/dict/' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/dict/' + row.id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/dict/',
    method: 'put',
    data: obj
  })
}

export function remote(type) {
  return request({
    url: '/dict/type/' + type,
    method: 'get'
  })
}
