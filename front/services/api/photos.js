import apiService from '../services/api-service'

const PhotosApi = {

  fetch(id) {
    return apiService.get(`articles/${id}/photos`)
  },

  update(id) {
    return apiService.put(`admin/articles/${id}/photos`)
  },
}

export default PhotosApi
