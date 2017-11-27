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

  delete(id) {
    const url = `${process.env.API_URL}apo/art/del/${id}`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.get(url, {}, options);
  },

  deleteAll() {
    const url = `${process.env.API_URL}apo/art/del`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.get(url, options);
  },

  deleteAndSyncAll() {
    const url = `${process.env.API_URL}apo/art/delsyn`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.get(url, options)
      .then(response => response.data);
  },
};

export default ArticlesApi;
