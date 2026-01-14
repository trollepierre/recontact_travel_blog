import { ofetch } from 'ofetch'
import env from '../env/env'
import logger from './logger-service'

const http = ofetch.create({
  baseURL: `${env('API_URL')}api/`,
  headers: { 'Cache-Control': `public, max-age=${24 * 3600}` },
})

const getAll = async path => {
  try {
    return await http(path, { method: 'GET' })
  } catch (error) {
    logger.error(error.message)
    throw error
  }
}

const post = async (path, data) => {
  try {
    return await http(path, { method: 'POST', body: data })
  } catch (error) {
    logger.error(error.message)
    throw error
  }
}

const put = async (path, data) => {
  try {
    return await http(path, { method: 'PATCH', body: data })
  } catch (error) {
    logger.error(error.message)
    throw error
  }
}

const deleteById = async path => {
  try {
    return await http(path, { method: 'DELETE' })
  } catch (error) {
    logger.error(error.message)
    throw error
  }
}

export default {
  get: getAll,
  post,
  put,
  delete: deleteById,
}
