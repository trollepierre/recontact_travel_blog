import axios from 'axios';

export default {

  fetchLast() {
    const url = `${process.env.API_URL}positions/last`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.get(url, options)
      .then(response => response.data.lastPosition);
  },
};
