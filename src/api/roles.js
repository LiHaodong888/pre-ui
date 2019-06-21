import request from '@/utils/request'

export function getRoleList(parms) {
  return request({
    url: '/role',
    method: 'get',
    params: parms
  })
}

export function deleteRole(id) {
  return request({
    url: '/role/' + id,
    method: 'delete'
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data: data
  })
}

/**
 * 更新角色
 * @param data
 */
export function updateRole(data) {
  return request({
    url: 'role',
    method: 'put',
    data: data
  })
}

/**
 * 根据角色id查找菜单
 * @param id
 */
export function findRoleMenus(id) {
  return request({
    url: '/role/findRoleMenus/' + id,
    method: 'get'
  })
}
