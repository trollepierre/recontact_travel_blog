import { resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'
import fs from 'node:fs'

// Charge .env.local puis .env avant l'évaluation de la config
loadEnv({ path: resolve(__dirname, '.env.local') })
loadEnv({ path: resolve(__dirname, '.env') })

const apiUrl = process.env.NUXT_PUBLIC_API_BASE ||
  process.env.NUXT_ENV_API_URL ||
  'http://localhost:3334'

// Charger les routes prérendues générées par scripts/prerender-routes.mjs
const prerenderFile = resolve(__dirname, '.prerender-routes.json')
let extraRoutes: string[] = []
try {
  if (fs.existsSync(prerenderFile)) {
    const raw = fs.readFileSync(prerenderFile, 'utf-8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      extraRoutes = parsed
    }
  }
} catch {}

export default defineNuxtConfig({
	compatibilityDate: '2026-01-16',
	// Génération statique avec prérendu
	nitro: {
		preset: 'static',
		output: {
			publicDir: 'dist',
		},
		prerender: {
			routes: ['/', '/articles', ...new Set(extraRoutes)],
		},
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
		server: {
			proxy: {
				'/api': {
					target: apiUrl,
					changeOrigin: true,
					secure: false,
				},
			},
		},
	},
	runtimeConfig: {
		public: {
			apiBase: apiUrl,
			language:
				process.env.NUXT_PUBLIC_LANGUAGE ||
				process.env.NUXT_ENV_LANGUAGE ||
				'fr',
			mapboxToken:
				process.env.NUXT_PUBLIC_MAPBOX_TOKEN ||
				process.env.NUXT_ENV_MAPBOX_API_TOKEN ||
				'',
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


