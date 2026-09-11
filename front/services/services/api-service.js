import { ofetch } from 'ofetch'
import env from '../env/env'
import logger from './logger-service'

const http = ofetch.create({
  baseURL: `${env('API_URL')}api/`,
  headers: {
    Accept: 'application/json',
    'Cache-Control': `public, max-age=${24 * 3600}`,
  },
})

const request = async (path, options) => {
  try {
    return await http(path, options)
  } catch (error) {
    logger.error(error.message)
    throw error
  }
}

const getAll = path => request(path, { method: 'GET' })

const post = (path, body) => request(path, { method: 'POST', body })

const put = (path, body) => request(path, { method: 'PATCH', body })

const deleteById = path => request(path, { method: 'DELETE' })

export default {
  get: getAll,
  post,
  put,
  delete: deleteById,
}
