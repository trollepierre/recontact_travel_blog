export default defineNuxtConfig({
	nitro: {
		preset: 'netlify',
	},
	css: [
		'~/assets/fonts/font.css',
		'~/assets/css/styles.css',
		'~/assets/css/mapbox-v2.0.1.css',
	],
	modules: [
		'@pinia/nuxt',
	],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use \"~/assets/css/colors.scss\" as *; @use \"~/assets/css/variables.scss\" as *;',
				},
			},
		},
	},
	runtimeConfig: {
		public: {
			apiBase: process.env.API_BASE || process.env.NUXT_ENV_API_URL || 'http://localhost:3334',
			language: process.env.NUXT_ENV_LANGUAGE || 'fr',
		},
	},
	app: {
		head: {
			htmlAttrs: { lang: 'fr' },
			meta: [
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'theme-color', content: '#FFFFFF' },
				{ name: 'msapplication-TileColor', content: '#DA532C' },
			],
			link: [
				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
				{ rel: 'manifest', href: '/manifest.json' },
				{ rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#000000' },
			],
		},
	},
})


