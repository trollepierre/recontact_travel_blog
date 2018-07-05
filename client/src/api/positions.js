import axios from 'axios';

export default {

  fetchLast() {
    const url = `${process.env.API_URL}api/positions/last`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.get(url, options)
      .then(response => response.data);
  },

  add(position) {
    const url = `${process.env.API_URL}api/positions`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.post(url, position, options)
      .then(response => response.data);
  },
};
