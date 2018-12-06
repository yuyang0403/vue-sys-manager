import request from '@/utils/request'

export function fetchUserList(query) {
  return request({
    url: '/user-manager/user/manager/findUserList',
    method: 'post',
    params: query
  })
}

export function fetchUserRole(userId) {
  return request({
    url: '/user-manager/role/manager/findRoleListByUserId',
    method: 'post',
    params: { userId }
  })
}

export function fetchUser(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createUser(data) {
  return request({
    url: '/user-manager/user/manager/createOrUpdateUser',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user-manager/user/manager/createOrUpdateUser',
    method: 'post',
    data
  })
}

export function modifyStatus(data) {
  return request({
    url: '/user-manager/user/manager/modifyStatus',
    method: 'post',
    data
  })
}
