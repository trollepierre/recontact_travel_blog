import { createI18n } from 'vue-i18n'

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()
	const messages = {
		en: () => import('~/locales/en.json').then(m => m.default || m),
		fr: () => import('~/locales/fr.json').then(m => m.default || m),
	}

	const initialLocale = (config.public.language as string) || 'fr'

	const i18n = createI18n({
		legacy: false,
		locale: initialLocale,
		fallbackLocale: 'fr',
		globalInjection: true,
		messages: {},
	})

	// Lazy loading des messages
	const loadLocale = async (loc: string) => {
		// @ts-ignore dynamic import wrapper above
		const loader = messages[loc] || messages.fr
		const loaded = await loader()
		i18n.global.setLocaleMessage(loc, loaded)
		i18n.global.locale.value = loc
	}

	// Charger la locale initiale
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	loadLocale(initialLocale)

	const app = useNuxtApp()
	app.vueApp.use(i18n)

	// Compat helper pour app.i18n.path
	app.provide('i18nPath', (link: string) => {
		const current = i18n.global.locale.value
		const fallback = 'fr'
		return current === fallback ? `/${link}` : `/${current}/${link}`
	})
})


