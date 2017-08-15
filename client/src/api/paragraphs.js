import axios from 'axios';

const ParagraphsApi = {

  fetchAll() {
    const url = `${process.env.API_URL}articles`;
    const options = { headers: { 'Content-Type': 'application/json' } };

    return axios.get(url, options)
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error));
  },
};

export default ParagraphsApi;
