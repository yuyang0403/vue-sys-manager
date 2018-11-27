import request from '@/utils/request'

export function loginByUsername(loginName, password) {
  const data = {
    loginName,
    password
  }
  return request({
    url: '/user-login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

