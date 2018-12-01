import request from '@/utils/request'

export function fetchRoleList() {
  return request({
    url: '/user-manager/role/manager/findRoleList',
    method: 'post'
  })
}
