import axios from 'axios'
import env from '../env/env'

const SyncApi = {

  launch() {
    const url = `${env('API_URL')}api/sync/`
    const options = { headers: { 'Content-Type': 'application/json', 'Referrer-Policy': 'no-referrer-when-downgrade' } }
    return axios.patch(url, options)
  },
}

export default SyncApi
