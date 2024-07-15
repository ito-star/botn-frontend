import axios from 'axios'

const http_get = (...params) => {
  return axios.get(...params)
}

const http_post = (...params) => {
  return axios.post(...params)
}

const http_put = (...params) => {
  return axios.put(...params)
}

const http_delete = (...params) => {
  console.log('httpdelete', params)
  return axios.delete(...params)
}

export const httpOperations = {
  http_get: http_get,
  http_post: http_post,
  http_put: http_put,
  http_delete: http_delete,
}
