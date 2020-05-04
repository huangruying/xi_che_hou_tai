import request from '@/utils/request'

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function findGeneralCoupon(data) {
  return request({
    url: '/wash/findGeneralCoupon',
    method: 'post',
    data: data
  })
}

export function batchCouponImport(data) {
    return request({
      url: '/wash/batchCouponImport',
      method: 'get',
      params: data
    })
}