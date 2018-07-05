import axios from 'axios';
import env from '../env/env.js'

const PhotosApi = {

  fetch(id) {
    const url = `${env('API_URL')}api/articles/${id}/photos`;
    const options = { headers: { 'Content-Type': 'application/json' } };

    return axios.get(url, options)
      .then(response => response.data);
  },
};

export default PhotosApi;
