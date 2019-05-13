import request from '@/utils/request'

export const getTable = () => {
  return request({
    url: '/code/table?table=pre',
    method: 'get'

  })
}

export const getColumn = () => {
  return request({
    url: '/code/column',
    method: 'get'
  })
}

export const testConnection = (data) => {
  return request({
    url: '/code/testConnection',
    method: 'post',
    data: data
  })
}

export const saveDb = (data) => {
  return request({
    url: '/db',
    method: 'post',
    data: data
  })
}

export const getDbList = () => {
  return request({
    url: '/db',
    method: 'get'
  })
}

export const deleteDbList = () => {
  return request({
    url: '/db',
    method: 'delete'
  })
}
