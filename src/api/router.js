import request from '@/utils/request'

export function findRouterFromServer() {
  return request({
    url: '/user-manager/user/manager/findRouterList',
    method: 'post'
  })
}
