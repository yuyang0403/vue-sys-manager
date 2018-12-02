import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import Qs from 'qs'

// create an axios instance
// 更改请求参数为application/x-www-form-urlencoded
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_urls
  timeout: 5000, // request timeout
  transformRequest: [function(data) {
    data = Qs.stringify(data)
    return data
  }],
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    // 让每个请求携带token-- ['token']为自定义key 请根据实际情况自行修改
    config.headers['token'] = getToken()
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => response,
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 100001:
          error.message = '客户端token失效请重新登录'
          this.request({
            url: '/user-login/login/logout',
            method: 'post'
          })
          break
        case 100002:
          error.message = 'token验证失败 请重新登录'
          this.request({
            url: '/user-login/login/logout',
            method: 'post'
          })
          break
        case 100003:
          error.message = '登录失败，用户名或者密码有误！'
          break
        case 500:
          error.message = '服务器异常！请稍后再试'
          break
        case 400:
          error.message = '请求参数有误！'
          break
        default:
          error.message = error.response.data.errorMessage
          break
      }
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
