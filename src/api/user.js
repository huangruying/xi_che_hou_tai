import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/wash/userLogin',
    method: 'post',
    data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function logout(data) {
  return request({
    url: '/wash/userLoginOut',
    method: 'post',
    data
  })
}
