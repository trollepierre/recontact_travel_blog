/* eslint-disable no-shadow */
import { getInLocalStorage, saveInLocalStorage } from '@/services/localStorage/local-storage'

export const state = () => ({
  locales: ['en', 'fr'],
  locale: process.env.NUXT_ENV_LANGUAGE ? process.env.NUXT_ENV_LANGUAGE : 'fr',
  theme: 'light',
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    }
  },
  SET_THEME_MODE(state, theme) {
    state.theme = theme
    saveInLocalStorage('theme', theme)
  },
  GET_THEME_MODE(state) {
    if (getInLocalStorage('theme')) {
      state.theme = getInLocalStorage('theme')
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      state.theme = 'dark'
    }
  },
}
