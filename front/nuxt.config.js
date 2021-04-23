/* eslint-disable object-curly-newline */
require('dotenv').config()

const headEn = {
  htmlAttrs: {
    lang: 'en',
  },
  title: 'Recontact.Me - Travelling Blog',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'Articles of the world trip of Pierre and Benoît - South America, Oceania, Asia, Europa, Central America',
    },
    { name: 'theme-color', content: '#FFFFFF' },
    { name: 'msapplication-TileColor', content: '#DA532C' },
  ],
  link: [
    { rel: 'canonical', href: 'https://www.recontact.me' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'manifest', href: '/manifest.json' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#000000' },
  ],
}

const headFr = {
  htmlAttrs: {
    lang: 'fr',
  },
  title: 'Recontact.Me - Blog de Voyage',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'Articles du tour du monde de Pierre et Benoît - Amérique du Sud, Océanie, Asie, Europe, Amérique centrale',
    },
    { name: 'theme-color', content: '#FFFFFF' },
    { name: 'msapplication-TileColor', content: '#DA532C' },
  ],
  link: [
    { rel: 'canonical', href: 'https://fr.recontact.me' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'manifest', href: '/manifest.json' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#000000' },
  ],
}

const articleRoutes = [...Array(92).keys()]
  .map((val, index) => `/articles/${index + 1}`)

module.exports = {
  target: 'static',
  css: [
    '~/assets/fonts/font.css',
    '~/assets/css/styles.css',
    '~/assets/css/mapbox-v2.0.1.css',
  ],

  // Global scss
  styleResources: {
    scss: ['./assets/css/*.scss'],
  },

  env: { NUXT_ENV_API_URL: process.env.NUXT_ENV_API_URL || 'https://recontact.herokuapp.com' },
  head: process.env.NUXT_ENV_LANGUAGE === 'en' ? headEn : headFr, // Headers of the page
  loading: { color: '#3B8070' }, // Customize the progress bar color
  router: {},
  plugins: [
    '~/plugins/i18n.js',
    '~/plugins/lazyload.js',
    // '~/plugins/modal.js',
    // '~/plugins/notification.js',
  ],
  generate: {
    routes: [
      '/',
      '/admin',
      ...articleRoutes,
    ],
  },
  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
  ],
  build: {
    postcss: {
      plugins: {
        // I disabled all plugins by default, not necessary for now
        // Disable a plugin by passing false as value
        // 'postcss-url': false,
        // 'postcss-nested': {},
        // 'postcss-responsive-type': {},
        // 'postcss-hexrgba': {}
      },
      preset: {
        autoprefixer: {
          grid: true,
        },
      },
    },
  },
}

