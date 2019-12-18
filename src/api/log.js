import request from '@/utils/request'

export function getLogList(parms) {
  return request({
    url: '/log',
    method: 'get',
    params: parms
  })
}

export function deleteLog(id) {
  return request({
    url: '/log/' + id,
    method: 'delete'
  })
}

export function getEsLogList(parms) {
  return request({
    url: '/es/page',
    method: 'get',
    params: parms
  })
}
