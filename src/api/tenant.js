import request from '@/utils/request'

// 租户模块

export function fetchList(query) {
  return request({
    url: '/tenant/page',
    method: 'get',
    params: query
  })
}

// 更新租户
export const updateTenant = (data) => {
  return request({
    url: '/tenant',
    method: 'put',
    data: data
  })
}
// 删除租户
export const deleteTenant = (id) => {
  return request({
    url: '/tenant/' + id,
    method: 'delete'
  })
}

// 新增用户
export function addTenant(data) {
  return request({
    url: '/tenant',
    method: 'post',
    data: data
  })
}

// 设置租户
export function settingTenant(id) {
  return request({
    url: '/tenant/setting/' + id,
    method: 'post'
  })
}

// 获取租户集合
export function getTenantList(data) {
  return request({
    url: '/tenant/list',
    method: 'get'
  })
}
