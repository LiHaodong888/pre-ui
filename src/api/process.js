import request from '@/utils/request'

/*
 * 流程管理模块
 */

//
export const getModelList = (parms) => {
  return request({
    url: '/model/list',
    method: 'get',
    params: parms
  })
}

// 流程列表
export const getProcessList = (parms) => {
  return request({
    url: '/define/list',
    method: 'get',
    params: parms
  })
}
