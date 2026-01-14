import { reactive } from 'vue'
import { useAppStore } from '@/stores/app'

export default defineNuxtPlugin(() => {
	const appStore = useAppStore()
	const config = useRuntimeConfig()
	appStore.initializeFromRuntimeConfig(config.public.language as string | undefined)

	const state = reactive({
		get locales() {
			return appStore.locales
		},
		get locale() {
			return appStore.locale
		},
		get theme() {
			return appStore.theme
		},
	})

	const storeShim = {
		state,
		commit(type: string, payload?: any) {
			switch (type) {
			case 'SET_LANG':
				appStore.setLang(payload)
				break
			case 'SET_THEME_MODE':
				appStore.setThemeMode(payload)
			 break
			case 'GET_THEME_MODE':
				appStore.getThemeMode()
				break
			default:
				// no-op
			}
		},
	}

	const app = useNuxtApp()
	app.vueApp.config.globalProperties.$store = storeShim
})


