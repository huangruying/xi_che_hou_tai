import request from '@/utils/request'

export function findInsuranceWriteoffOrder(data) {
  return request({
    url: '/wash/findInsuranceWriteoffOrder',
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
