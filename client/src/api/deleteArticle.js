import axios from 'axios';

const DeleteArticle = {

  deleteArticle(id) {
    const url = `${process.env.API_URL}api/admin/articles/${id}`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return axios.delete(url, options);
  },
};

export default DeleteArticle;
