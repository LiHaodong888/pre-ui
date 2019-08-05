import request from '@/utils/request'

/**
 * 岗位信息模块
 * @param parms
 */

// 获取社交登录列表
export function getTableList(parms) {
  return request({
    url: '/codegen/getTableList',
    method: 'get',
    params: parms
  })
}

/**
 * 根据id删除岗位
 * @param parms
 */
export function getTableColumnList(parms) {
  return request({
    url: '/codegen/getTableColumnList',
    method: 'get',
    params: parms
  })
}

export function codegen(data) {
  return request({
    url: '/codegen/codegen',
    method: 'post',
    data: data
  })
}
