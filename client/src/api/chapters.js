import axios from 'axios';

const ChaptersApi = {

  fetch(id) {
    const url = `${process.env.API_URL}api/articles/${id}`;
    const options = { headers: { 'Content-Type': 'application/json' } };

    return axios.get(url, options)
      .then(response => response.data);
  },
};

export default ChaptersApi;
