import request from '@/utils/request'

// export function getList(params) {
//   return request({
//     url: '/vue-admin-template/table/list',
//     method: 'get',
//     params
//   })
// }

export function getList(data) {
  return request({
    url: '/wash/findDotInfos',
    method: 'post',
    data
  })
}

export function examineDot(data) {
  return request({
    url: '/wash/examineDot',
    method: 'post',
    data
  })
}

// export function dotOssUpload(params) {
//   return request({
//     url: '/wash/dotOssUpload',
//     method: 'get',
//     params
//   })
// }
export function dotOssUpload(params) {
  return request({
    url: '/wash/dotOssUpload',
    method: 'post',
    data: params
  })
}

export function updateDot(params) {
  return request({
    url: '/wash/updateDot',
    method: 'post',
    data: params
  })
}

export function saveDot(params) {
  return request({
    url: '/wash/saveDot',
    method: 'post',
    data: params
  })
}

export function dotExport(params) {
  return request({
    url: '/wash/dotExport',
    method: 'get',
    params
  })
}