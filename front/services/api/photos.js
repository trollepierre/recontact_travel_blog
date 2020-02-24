import apiService from '../services/api-service'

const PhotosApi = {

  fetch(id) {
    return apiService.get(`articles/${id}/photos`)
  },
}

export default PhotosApi
