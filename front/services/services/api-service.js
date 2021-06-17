import axios from 'axios'
import { cacheAdapterEnhancer } from 'axios-extensions'
import env from '../env/env'
import logger from './logger-service'

const http = axios.create({
  baseURL: `${env('API_URL')}api/`,
  headers: { 'Cache-Control': `public, max-age=${24 * 3600}` },
  adapter: cacheAdapterEnhancer(axios.defaults.adapter),
})

const getAll = async path => {
  try {
    const response = await http.get(path, { json: true })
    return response.data
  } catch (error) {
    logger.error(error.message)
    throw error
  }
}

const post = async (path, data) => {
  try {
    const response = await http.post(path, { ...data, json: true })
    return response.data
  } catch (error) {
    logger.error(error.message)
    throw error
  }
}

const put = async (path, data) => {
  try {
    const response = await http.patch(path, { ...data, json: true })
    return response.data
  } catch (error) {
    logger.error(error.message)
    throw error
  }
}

const deleteById = async path => {
  try {
    const response = await http.delete(path)
    return response.data
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
