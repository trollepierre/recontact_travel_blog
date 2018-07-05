import axios from 'axios';
import env from '../env/env.js'

const SyncApi = {

  launch() {
    const url = `${env('API_URL')}api/sync/`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.patch(url, options);
  },
};

export default SyncApi;
