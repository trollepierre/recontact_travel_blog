/* eslint-disable no-shadow */
export const state = () => ({
  locales: ['en', 'fr'],
  locale: process.env.NUXT_ENV_LANGUAGE ? process.env.NUXT_ENV_LANGUAGE : 'fr',
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    }
  },
}
