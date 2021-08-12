import apiService from '../services/api-service'

const SyncApi = {
  launch() {
    const url = 'sync/'
    return apiService.patch(url)
  },
}

export default SyncApi
