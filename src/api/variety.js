import request from '@/utils/request'

export function fetchList(query) { // 品系管理列表
  return request({
    url: '/micevarieties/page',
    method: 'get',
    params: query
  })
}

export function varietiesList(query) { // 品系列表
  return request({
    url: '/micevarieties/list',
    method: 'get',
    params: query
  })
}

export function addItemObj(obj) { // 新增品系
  return request({
    url: '/micevarieties',
    method: 'post',
    data: obj
  })
}

export function getItemObj(id) { // 获取详情
  return request({
    url: '/micevarieties/' + id,
    method: 'get'
  })
}

export function delItemObj(id) { // 删除品系
  return request({
    url: '/micevarieties/' + id,
    method: 'delete'
  })
}

export function putItemObj(obj) { // 修改品系
  return request({
    url: '/micevarieties',
    method: 'put',
    data: obj
  })
}
