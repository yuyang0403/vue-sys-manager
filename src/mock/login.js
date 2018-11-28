export default {
  loginByUsername: config => {
    return JSON.parse(config.body)
  },
  getUserInfo: config => {
    return config.body
  },
  logout: () => 'success'
}
