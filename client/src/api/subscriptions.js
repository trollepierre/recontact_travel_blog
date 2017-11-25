import axios from 'axios';
import translationsService from '@/services/translations';

export default {

  subscribe(email) {
    const lang = translationsService.getNavigatorLanguage();
    const url = `${process.env.API_URL}api/subscriptions`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.post(url, { email, lang }, options);
  },
};
