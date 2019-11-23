import axios from 'axios'
import translationsService from '../services/translations'
import env from '../env/env'

export default {

  subscribe(email) {
    const lang = translationsService.getNavigatorLanguage()
    const url = `${env('API_URL')}api/subscriptions`
    const options = { headers: { 'Content-Type': 'application/json', 'Referrer-Policy': 'no-referrer-when-downgrade' } }
    return axios.post(url, { email, lang }, options)
  },

  fetchAll() {
    const url = `${env('API_URL')}apo/sub`
    const options = { headers: { 'Content-Type': 'application/json', 'Referrer-Policy': 'no-referrer-when-downgrade' } }
    return axios.get(url, {}, options)
      .then(response => response.data)
  },

  delete(id) {
    const url = `${env('API_URL')}apo/sub/del/${id}`
    const options = { headers: { 'Content-Type': 'application/json', 'Referrer-Policy': 'no-referrer-when-downgrade' } }
    return axios.get(url, {}, options)
  },
}
