import axios from 'axios'
import { prop } from 'ramda'
import env from '../env/env'
import logger from './logger-service'

const apiPath = `${env('API_URL') }api/`

const getAll = async path => {
  try {
    const url = `${apiPath}${path}`
    const response = await axios.get(url, { json: true })
    return prop('data', response)
  } catch (error) {
    logger.error(error.message)
    throw error
  }
}

const post = async (path, data) => {
  try {
    const url = `${apiPath}${path}`
    const response = await axios.post(url, { ...data, json: true })
    return prop('data', response)
  } catch (error) {
    logger.error(error.message)
    throw error
  }
}

const put = async (path, data) => {
  try {
    const url = `${apiPath}${path}`
    const response = await axios.patch(url, { ...data, json: true })
    return prop('data', response)
  } catch (error) {
    logger.error(error.message)
    throw error
  }
}

const deleteById = async path => {
  try {
    const url = `${apiPath}${path}`
    const response = await axios.delete(url)
    return prop('data', response)
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
