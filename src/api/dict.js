import request from '@/utils/request'

/*
 * 字典管理模块
 */

// 保存字典
export const saveDict = (data) => {
  return request({
    url: '/dict',
    method: 'post',
    data: data
  })
}
// 获取字典列表
export const getDict = (parms) => {
  return request({
    url: '/dict',
    method: 'get',
    params: parms
  })
}

// 获取字典列表
export const getDictDetail = (parms) => {
  return request({
    url: '/dict/getDictDetailList',
    method: 'get',
    params: parms
  })
}

// 更新部门
export const updateDict = (data) => {
  return request({
    url: '/dict',
    method: 'put',
    data: data
  })
}
// 根据主键删除字典
export const deleteDict = (id) => {
  return request({
    url: '/dict/' + id,
    method: 'delete'
  })
}

// 根据名称删除字典
export const deleteDictByName = (name) => {
  return request({
    url: '/dict/delete/',
    method: 'delete',
    params: { name: name }
  }
  )
}
