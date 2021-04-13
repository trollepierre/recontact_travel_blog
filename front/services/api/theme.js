import apiService from '@/services/services/api-service'

const ThemeApi = {

  send(previousTheme, newTheme) {
    return apiService.post('theme', {previous: previousTheme, new: newTheme})
  },
}

export default ThemeApi
