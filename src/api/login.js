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

export function logout(token) {
  return request({
    url: '/user-login/login/logout',
    method: 'post',
    params: { token }
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user-manager/info',
    method: 'get',
    params: { token }
  })
}

