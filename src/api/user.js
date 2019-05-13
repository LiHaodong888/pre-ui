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
