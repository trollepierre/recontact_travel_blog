import axios from 'axios'
import env from '../env/env'

const ChaptersApi = {

  fetch(id) {
    const url = `${env('API_URL')}api/articles/${id}`
    const options = { headers: { 'Content-Type': 'application/json', 'Referrer-Policy': 'no-referrer-when-downgrade' } }

    return axios.get(url, options)
      .then(({ data }) => data)
  },
}

export default ChaptersApi
