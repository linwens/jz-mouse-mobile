import request from '@/utils/request'

export function fetchList(query) { // 待办事项列表查询
  return request({
    url: '/sysremind/page',
    method: 'get',
    params: query
  })
}

export function getSysRemindNum() { // 获取待办事项数量
  return request({
    url: '/sysremind/getSysRemindNum',
    method: 'get'
  })
}

export function addItemObj(obj) { // 新增待办事项
  return request({
    url: '/sysremind',
    method: 'post',
    data: obj
  })
}

export function getItemObj(id) { // 获取待办事项
  return request({
    url: '/sysremind/' + id,
    method: 'get'
  })
}

export function delItemObj(id) { // 删除待办事项
  return request({
    url: '/sysremind/' + id,
    method: 'delete'
  })
}

export function allReaded(obj) { // 一键已读操作
  return request({
    url: '/sysremind/batch',
    method: 'post',
    data: obj
  })
}

export function markReaded(id) { // 已读操作
  return request({
    url: '/sysremind/' + id,
    method: 'post'
  })
}

export function putItemObj(obj) { // 修改待办事项
  return request({
    url: '/sysremind',
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
