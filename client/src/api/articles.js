import axios from 'axios';

const ArticlesApi = {

  fetchAll() {
    const url = `${process.env.API_URL}api/articles`;
    const options = { headers: { 'Content-Type': 'application/json' } };

    return axios.get(url, options)
      .then(response => response.data);
  },

  update(id) {
    const url = `${process.env.API_URL}api/admin/articles/${id}`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.patch(url, {}, options);
  },

};

export default ArticlesApi;
