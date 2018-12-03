import request from '@/utils/request'

export function fetchUserList(query) {
  return request({
    url: '/user-manager/user/manager/findUserList',
    method: 'post',
    params: query
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
    url: '/user-manager/user/manager/createUser',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
