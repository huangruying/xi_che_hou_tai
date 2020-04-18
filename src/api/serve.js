import request from '@/utils/request'

export function findServiceOrderInfos(data) {
  return request({
    url: '/wash/findServiceOrderInfos',
    method: 'post',
    data
  })
}