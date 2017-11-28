import axios from 'axios';
import translationsService from '@/services/translations';

export default {

  subscribe(email) {
    const lang = translationsService.getNavigatorLanguage();
    const url = `${process.env.API_URL}api/subscriptions`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.post(url, { email, lang }, options);
  },

  fetchAll() {
    const url = `${process.env.API_URL}apo/sub`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.get(url, {}, options)
      .then(response => response.data);
  },

  delete(id) {
    const url = `${process.env.API_URL}apo/sub/del/${id}`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.get(url, {}, options);
  },
};
