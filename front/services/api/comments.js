import apiService from '../services/api-service'

const CommentsApi = {

  fetch(id) {
    return apiService.get(`articles/${id}/comments`)
  },

  send(id, comment) {
    return apiService.post(`articles/${id}/comments`, comment)
  },
}

export default CommentsApi
