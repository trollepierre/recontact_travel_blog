import { createI18n } from 'vue-i18n'
import en from '~/locales/en.json'
import fr from '~/locales/fr.json'

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()
	const initialLocale = (config.public.language as string) || 'fr'

	const i18n = createI18n({
		legacy: false,
		locale: initialLocale,
		fallbackLocale: 'fr',
		globalInjection: true,
		messages: { en, fr },
	})

	const app = useNuxtApp()
	app.vueApp.use(i18n)

	// Compat helper pour app.i18n.path
	app.provide('i18nPath', (link: string) => {
		const current = i18n.global.locale.value
		const fallback = 'fr'
		return current === fallback ? `/${link}` : `/${current}/${link}`
	})
})


