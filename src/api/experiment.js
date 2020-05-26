import request from '@/utils/request'

export function fetchList(query) { // 实验组分页
  return request({
    url: '/experiment/page',
    method: 'get',
    params: query
  })
}

export function getGroupSampleList(query) { // 实验分组列表
  return request({
    url: '/experimentSampleGroup/getExperimentSampleGroupPage',
    method: 'get',
    params: query
  })
}

export function getExptRecord(query) { // 实验记录弹窗
  return request({
    url: '/experiment/experimentTime/page',
    method: 'get',
    params: query
  })
}

export function addTags(query) { // 新增实验组标签表
  return request({
    url: '/experiment/saveExperimentLabels',
    method: 'get',
    params: query
  })
}

export function addNewExpt(obj) { // 新增实验组
  return request({
    url: '/experiment/meanwhileSaveExperimentInfo',
    method: 'post',
    data: obj
  })
}

export function addNewGroup(obj) { // 新增实验分组
  return request({
    url: '/experimentSampleGroup',
    method: 'post',
    data: obj
  })
}

export function setExptTime(obj) { // 新增实验组时间
  return request({
    url: '/experiment/saveExperimentTime',
    method: 'post',
    data: obj
  })
}

export function getExptInfoById(query) { // 根据id获取实验组信息
  return request({
    url: '/experiment/getExperimentInfoById',
    method: 'get',
    params: query
  })
}

export function getMouseByGroupId(query) { // 根据分组id获取小鼠列表
  return request({
    url: '/miceinfo/getMiceInfoByExperimentGroupId',
    method: 'get',
    params: query
  })
}

export function updateExptInfo(obj) { // 同步修改实验组，实验分组，实验组标签
  return request({
    url: '/experiment/meanwhileUpdateExperimentInfo',
    method: 'post',
    data: obj
  })
}

export function delExptObj(id) { // 删除实验组
  return request({
    url: '/experiment/' + id,
    method: 'delete'
  })
}

export function delExptRecord(id) { // 删除实验记录
  return request({
    url: '/experiment/deleteExperimentRecord?id=' + id,
    method: 'delete'
  })
}

export function endExpt(query) { // 手动结束实验
  return request({
    url: '/experiment',
    method: 'put',
    params: query
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
