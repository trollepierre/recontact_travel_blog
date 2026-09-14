import apiService from '../services/api-service'

const ArticlesApi = {

  fetchAll(limit) {
    return apiService.get(`articles?limit=${limit}`)
  },

  update(id) {
    return apiService.patch(`admin/articles/${id}`)
  },

  delete(id) {
    return apiService.get(`apo/art/del/${id}`)
  },

  updateAll(min, max) {
    const data = { min, max }
    return apiService.patch('admin/articles', data)
  },

  deleteAll() {
    return apiService.get('apo/art/del')
  },

  deleteAndSyncAll() {
    return apiService.get('apo/art/delsyn')
  },
}

export default ArticlesApi
