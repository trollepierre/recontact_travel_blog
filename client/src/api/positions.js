import axios from 'axios';
import env from '../env/env.js'

export default {

  fetchLast() {
    const url = `${env('API_URL')}api/positions/last`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.get(url, options)
      .then(response => response.data);
  },

  add(position) {
    const url = `${env('API_URL')}api/positions`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.post(url, position, options)
      .then(response => response.data);
  },
};
