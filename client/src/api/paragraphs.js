import axios from 'axios';

const ParagraphsApi = {

  fetchAll(id) {
    const url = `${process.env.API_URL}api/articles/${id}`;
    const options = { headers: { 'Content-Type': 'application/json' } };

    return axios.get(url, options)
      .then(response => Promise.resolve(response.data.paragraphs))
      .catch(error => Promise.reject(error));
  },
};

export default ParagraphsApi;
