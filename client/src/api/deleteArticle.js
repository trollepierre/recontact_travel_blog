import axios from 'axios';

const DeleteArticle = {

  deleteArticle(id) {
    const url = `${process.env.API_URL}api/admin/articles/${id}/delete`;
    const options = { headers: { 'Content-Type': 'application/json' } };

    return axios.get(url, options);
  },
};

export default DeleteArticle;
