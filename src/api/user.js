import request from '@/utils/request'

export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data: data
  })
}

// 获取用户列表
export function getUserList(parms) {
  return request({
    url: '/user',
    method: 'get',
    params: parms
  })
}

export function editUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data: data
  })
}
export function restPass(id) {
  return request({
    url: '/user/' + id,
    method: 'put'
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}

// 获取用户个人信息
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 修改密码
export function updatePass(parms) {
  return request({
    url: '/user/updatePass',
    method: 'put',
    params: parms
  })
}
// 修改邮箱
export function updateEmail(parms) {
  return request({
    url: '/user/updateEmail',
    method: 'put',
    params: parms
  })
}

// 发送邮箱验证码
export function resetEmail(parms) {
  return request({
    url: '/user/sendMailCode',
    method: 'post',
    params: parms
  })
}
