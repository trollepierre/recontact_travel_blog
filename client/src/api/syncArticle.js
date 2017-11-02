import axios from 'axios';

const SyncArticle = {

  syncArticle(id) {
    const url = `${process.env.API_URL}api/admin/articles/${id}/sync`;
    const options = { headers: { 'Content-Type': 'application/json' } };

    return axios.get(url, options);
  },
};

export default SyncArticle;
