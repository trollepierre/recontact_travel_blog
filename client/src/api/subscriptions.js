import axios from 'axios';

export default {

  subscribe(email) {
    const url = `${process.env.API_URL}api/subscriptions`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.post(url, { email }, options);
  },
};
