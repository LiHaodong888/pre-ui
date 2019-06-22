import request from '@/utils/request'

export function loginByUsername(username, password, captcha) {
  const data = {
    username,
    password,
    captcha
  }
  // 登录
  return request({
    url: '/login',
    method: 'post',
    params: data
  })
}

// 登出
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/info',
    method: 'get'
  })
}

