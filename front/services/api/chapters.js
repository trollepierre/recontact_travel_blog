import apiService from '../services/api-service'

const ChaptersApi = {
  fetch(id) {
    return apiService.get(`articles/${id}`)
  },
}

export default ChaptersApi
