import request from '@/utils/request'

export function loginByUsername(username, password, code, token, t) {
  const data = {
    username,
    password,
    code,
    token,
    t
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

// 根据手机
export function loginByUserPhone(phone, smsCode) {
  const data = {
    phone,
    smsCode
  }
  // 登录
  return request({
    url: '/mobile/login',
    method: 'post',
    params: data
  })
}
