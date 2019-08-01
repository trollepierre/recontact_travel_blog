import apiService from '../services/api-service'

const ArticlesApi = {

  fetchAll() {
    return apiService.get('articles')
  },

  update(id) {
    return apiService.put(`admin/articles/${id}`, {})
  },

  delete(id) {
    return apiService.get(`apo/art/del/${id}`)
  },

  updateAll(min, max) {
    const data = { min, max }
    return apiService.put('admin/articles', data)
  },

  deleteAll() {
    return apiService.get('apo/art/del')
  },

  deleteAndSyncAll() {
    return apiService.get('apo/art/delsyn')
  },
}

export default ArticlesApi
