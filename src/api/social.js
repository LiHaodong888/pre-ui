import request from '@/utils/request'

/**
 * 社交登录账户模块
 * @param parms
 */

// 获取社交登录列表
export function getSocialList(parms) {
  return request({
    url: '/social',
    method: 'get',
    params: parms
  })
}

/**
 * 根据id删除岗位
 * @param parms
 */
export function untied(parms) {
  return request({
    url: '/social/untied',
    method: 'post',
    params: parms
  })
}
