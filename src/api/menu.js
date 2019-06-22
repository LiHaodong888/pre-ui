import request from '@/utils/request'

/*
 * 菜单管理模块
 */

// 保存
export const saveMenu = (data) => {
  return request({
    url: '/menu',
    method: 'post',
    data: data
  })
}
// 删除
export const deleteMenu = (id) => {
  return request({
    url: '/menu/' + id,
    method: 'delete'
  })
}
// 查找导航菜单树
export const getMenuTree = () => {
  return request({
    url: '/menu',
    method: 'get'
  })
}

// 获取路由
export const getRouters = () => {
  return request({
    url: '/menu/getRouters',
    method: 'get'
  })
}
// 获取菜单列表
export const getMenus = () => {
  return request({
    url: '/menu/getMenus',
    method: 'get'
  })
}

// 更新菜单
export function updateMenu(data) {
  return request({
    url: '/menu',
    method: 'put',
    data: data
  })
}
