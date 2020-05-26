import request from '@/utils/request'
import qs from 'qs'

export function fetchCageList(query) { // 鼠笼列表
  return request({
    url: '/micecage/page',
    method: 'get',
    params: query
  })
}

export function recordList(query) { // 记录列表
  return request({
    url: '/dict/page',
    method: 'get',
    params: query
  })
}

export function getCageInfo(id) { // 获取鼠笼信息
  return request({
    url: '/micecage/' + id,
    method: 'get'
  })
}

export function addCage(obj) { // 新增笼位
  return request({
    url: '/micecage',
    method: 'post',
    data: obj
  })
}

export function editCage(obj) { // 编辑笼位
  return request({
    url: '/micecage',
    method: 'put',
    data: obj
  })
}

export function editMouse(obj) { // 编辑小鼠信息
  return request({
    url: '/miceinfo',
    method: 'put',
    data: obj
  })
}

export function addMouse(obj) { // 新增小鼠
  return request({
    url: '/miceinfo',
    method: 'post',
    data: obj
  })
}

export function getMouseInfo(id) { // 获取小鼠信息
  return request({
    url: '/miceinfo/' + id,
    method: 'get'
  })
}

export function getMouseState(id) { // 获取小鼠状态
  return request({
    url: '/miceinfo/state/' + id,
    method: 'get'
  })
}

export function getMouseInfoByIds(id) { // 获取小鼠信息
  return request({
    url: '/miceinfo/getById?ids=' + id,
    method: 'get'
  })
}

export function getMiceInfoByIds(data) { // 通过小鼠id集合查询小鼠信息（通过小鼠id集合查询小鼠信息）
  return request({
    url: '/miceinfo/getMiceInfoByIds',
    method: 'post',
    data
  })
}

export function getNewCageNo(id) { // 获取最新笼位号
  return request({
    url: '/micecage/getNewRoomId',
    method: 'get'
  })
}

export function getMouseExpInfo(id) { // 获取小鼠实验组信息
  return request({
    url: '/experiment/getMiceExperimentRecord?miceId=' + id,
    method: 'get'
  })
}

export function delItemObj(id) {
  return request({
    url: '/dict/item/' + id,
    method: 'delete'
  })
}

export function transferCage(obj) { // 移笼操作
  return request({
    url: '/miceinfo/transferCageByMiceId',
    method: 'post',
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

export function getMouseTree(query) { // 获取小鼠家谱树
  return request({
    url: '/miceinfo/relation/tree',
    method: 'get',
    params: query
  })
}

export function getMouseChildrenTree(query) { // 获取小鼠子鼠树
  return request({
    url: '/miceinfo/subRelation/tree',
    method: 'get',
    params: query
  })
}

export function delMiceByMiceId(query) { // 移除小鼠(可批量)
  return request({
    url: '/miceinfo/deleteMiceByMiceId',
    method: 'delete',
    params: query,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: false })
    }
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
