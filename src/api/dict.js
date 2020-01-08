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

// 根据字典id获取字典详情列表
export const queryDictItemList = (parms) => {
  return request({
    url: '/dictItem',
    method: 'get',
    params: parms
  })
}
export const queryDictItemByDictName = (dictName) => {
  return request({
    url: '/dict/queryDictItemByDictName/' + dictName,
    method: 'get'
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

// 保存字典详情
export const addDictItem = (data) => {
  return request({
    url: '/dictItem',
    method: 'post',
    data: data
  })
}
// 更新字典详情
export const updateDictItem = (data) => {
  return request({
    url: '/dictItem',
    method: 'put',
    data: data
  })
}

// 根据主键删除字典详情
export const deleteDictItem = (id) => {
  return request({
    url: '/dictItem/' + id,
    method: 'delete'
  })
}
