import request from '@/utils/request'

export function findDotWriteoffOrder(data) {
  return request({
    url: '/wash/findDotWriteoffOrder',
    method: 'post',
    data
  })
}

export function updateReconciliation(data) {
  return request({
    url: '/wash/updateReconciliation',
    method: 'post',
    data
  })
}

