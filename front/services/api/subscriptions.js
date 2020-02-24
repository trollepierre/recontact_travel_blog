import translationsService from '../services/translations'
import apiService from '../services/api-service'

export default {

  subscribe(email) {
    const lang = translationsService.getNavigatorLanguage()
    return apiService.post('subscriptions', { email, lang })
  },

  fetchAll() {
    return apiService.get('apo/sub')
  },

  delete(id) {
    return apiService.get(`apo/sub/del/${id}`)
  },
}
