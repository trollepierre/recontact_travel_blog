import axios from 'axios';

const SyncApi = {

  launch() {
    const url = `${process.env.API_URL}api/sync/`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.get(url, options);
  },
};

export default SyncApi;
