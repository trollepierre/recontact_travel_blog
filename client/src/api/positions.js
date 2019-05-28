import apiService from '../services/api-service'

export default {

  fetchLast() {
    return apiService.get('positions/last')
  },

  add(position) {
    return apiService.post('positions', position)
  },
}
