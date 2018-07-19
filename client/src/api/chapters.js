import axios from 'axios'
import env from '../env/env.js'

const ChaptersApi = {

  fetch(id) {
    const url = `${env('API_URL')}api/articles/${id}`
    const options = { headers: { 'Content-Type': 'application/json' } }

    return axios.get(url, options)
      .then(response => response.data)
  },
}

export default ChaptersApi
