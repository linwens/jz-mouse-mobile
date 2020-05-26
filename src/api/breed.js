import request from '@/utils/request'

export function fetchList(query) { // 繁育组列表
  return request({
    url: '/micebreed/page',
    method: 'get',
    params: query
  })
}

export function fetchItemList(query) {
  return request({
    url: '/dict/item/page',
    method: 'get',
    params: query
  })
}

export function addBreed(obj) { // 增加繁育组
  return request({
    url: '/micebreed',
    method: 'post',
    data: obj
  })
}

export function editBreed(obj) { // 编辑繁育组
  return request({
    url: '/micebreed/editBreedDetailsById',
    method: 'post',
    data: obj
  })
}

export function getbreedDetail(query) { // 获取繁育组详情
  return request({
    url: '/micebreed/detail',
    method: 'get',
    params: query
  })
}

export function delBreedGroup(id) { // 删除繁育组
  return request({
    url: '/micebreed/' + id,
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

export function removeBreedMouse(query) { // 移除小鼠
  return request({
    url: '/micebreed/removeBreedDetailsById',
    method: 'get',
    params: query
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
