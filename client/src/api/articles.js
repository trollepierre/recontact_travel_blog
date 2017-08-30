import axios from 'axios';

const ArticlesApi = {

  fetchAll() {
    const url = `${process.env.API_URL}api/articles`;
    console.log('url : ', url);

    const options = { headers: { 'Content-Type': 'application/json' } };

    return axios.get(url, options)
      .then(response => response.data)
      .catch(error => Promise.reject(error));
  },
};

export default ArticlesApi;
