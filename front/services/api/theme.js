import apiService from '@/services/services/api-service'

const ThemeApi = {

  send(previousTheme, newTheme) {
    return apiService.post('theme', { previousTheme, newTheme })
  },
}

export default ThemeApi
