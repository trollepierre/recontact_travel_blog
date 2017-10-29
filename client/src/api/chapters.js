import axios from 'axios';

const ChaptersApi = {

  fetchAll(id) {
    const url = `${process.env.API_URL}api/articles/${id}`;
    const options = { headers: { 'Content-Type': 'application/json' } };

    return axios.get(url, options)
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error));
  },
};

export default ChaptersApi;
