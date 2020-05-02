require('dotenv').config()

const headEn = {
  htmlAttrs: {
    lang: 'en',
  },
  title: 'Recontact.Me - Travelling Blog',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'Articles of the world trip of Pierre and Benoît - South America, Oceania, Asia, Europa, Central America',
    },
    { name: 'theme-color', content: '#FFFFFF' },
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
  htmlAttrs: {
    lang: 'fr',
  },
  title: 'Recontact.Me - Blog de Voyage',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'Articles du tour du monde de Pierre et Benoît - Amérique du Sud, Océanie, Asie, Europe, Amérique centrale',
    },
    { name: 'theme-color', content: '#FFFFFF' },
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

const articleRoutes = [...Array(92).keys()]
  .map((val, index) => `/articles/${index + 1}`)

module.exports = {
  css: [
    '~/assets/fonts/font.css',
    '~/assets/css/styles.css',
  ],
  env: { NUXT_ENV_API_URL: process.env.NUXT_ENV_API_URL || 'https://recontact.herokuapp.com' },
  head: process.env.NUXT_ENV_LANGUAGE === 'en' ? headEn : headFr, // Headers of the page
  loading: { color: '#3B8070' }, // Customize the progress bar color
  router: {}, // middleware: 'i18n'
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
  modules: ['@nuxtjs/dotenv'],
}

