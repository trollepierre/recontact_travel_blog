export const state = () => {
  return {
    locales: ['en', 'fr'],
    locale: process.env.NUXT_ENV_LANGUAGE ? process.env.NUXT_ENV_LANGUAGE : 'fr',
  }
}

export const mutations = {
  SET_LANG(state, locale) {
    console.log('inside mutations set lang')
    if (state.locales.includes(locale)) {
      state.locale = locale
    }
  },
}

