require('dotenv').config()

const language = process.env.LANGUAGE

const headEn = {
  title: 'Recontact.Me - Travelling Blog',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { hid: 'description', name: 'description', content: 'Articles of the world trip of Pierre and Benoît - South America, Oceania, Asia, Europa, Central America' },
    { name: 'theme-color', content: '#ffffff' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: 'https://www.recontact.me' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto' },
    { rel: 'apple-touch-icon', sizes: '120x120', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'manifest', href: '/manifest.json' },
  ],
}

const headFr = {
  title: 'Recontact.Me - Blog de Voyage',
    meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { hid: 'description', name: 'description', content: 'Articles du tour du monde de Pierre et Benoît - Amérique du Sud, Océanie, Asie, Europe, Amérique centrale' },
    { name: 'theme-color', content: '#ffffff' },
  ],
    link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: 'https://fr.recontact.me' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto' },
    { rel: 'apple-touch-icon', sizes: '120x120', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'manifest', href: '/manifest.json' },
  ],
}

const articleRoutes = [...Array(100).keys()]
  .map((val, index) => `/articles/${index}`)

module.exports = {
  /*
  ** Headers of the page
  */
  head: language === 'en' ? headEn : headFr,
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },

  // Pour i18n
  router: {
    // middleware: 'i18n'
  },
  plugins: [
    // '~/plugins/analytics.js',
    '~/plugins/i18n.js',
    '~/plugins/lazyload.js',
    // '~/plugins/modal.js',
    '~/plugins/notification.js',
  ],
  generate: {
    routes: [
      '/',
      '/admin',
      ...articleRoutes,
    ],
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },
  },

  modules: [
    '@nuxtjs/dotenv',
  ],
}

