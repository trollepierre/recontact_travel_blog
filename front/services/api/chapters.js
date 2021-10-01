import apiService from '../services/api-service'

const ChaptersApi = {
  fetch(id) {
    return apiService.get(`articles/${id}`)
  },

  update(id, position) {
    return apiService.put(`admin/articles/${id}/chapters/${position}`)
  },
}

export default ChaptersApi
