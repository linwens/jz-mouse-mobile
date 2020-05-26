import request from '@/utils/request'
// 一些公共组件的请求
export function getFilesList(data) { // 请求文件列表
  const { bizType, bizId, ...other } = data
  return request({
    url: `/sysfile/${bizType}/${bizId}`,
    method: 'get',
    params: other
  })
}

// export function getUploadParams(query) { // 获取OSS上传参数
//   return request({
//     baseURL: process.env.VUE_APP_FILE_API,
//     url: '/api/fileManage/uploadParam',
//     method: 'get',
//     params: query
//   })
// }

export function uploadFiles(obj) { // 图片批量上传
  return request({
    url: '/sysfile/uploadFiles',
    method: 'post',
    data: obj
  })
}

// export function uploadFiles(obj) { // 图片批量上传
//   const { bizType, id, files } = obj
//   return request({
//     url: id ? `/sysfile/uploads/${bizType}/${id}` : '/sysfile/uploadFiles',
//     method: 'post',
//     data: files
//   })
// }

export function saveFiles(obj) { // 存储图片地址
  return request({
    url: '/sysfile',
    method: 'post',
    data: obj
  })
}

export function getItemObj(id) {
  return request({
    url: '/dict/item/' + id,
    method: 'get'
  })
}

export function delFile(id) { // 删除文件
  return request({
    url: '/sysfile/' + id,
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

export function changeOperator(query) { // 切换负责人
  return request({
    url: '/micecage/cageChangeLeader',
    method: 'post',
    params: query
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
