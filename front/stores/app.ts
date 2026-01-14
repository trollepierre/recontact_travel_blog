import { defineStore } from 'pinia'
import { getInLocalStorage, saveInLocalStorage } from '@/services/localStorage/local-storage'

export const useAppStore = defineStore('app', {
	state: () => {
		return {
			locales: ['en', 'fr'] as Array<string>,
			locale: 'fr' as string,
			theme: 'light' as 'light' | 'dark' | 'new',
		}
	},
	actions: {
		initializeFromRuntimeConfig(language: string | undefined) {
			if (language && this.locales.includes(language)) {
				this.locale = language
			}
		},
		setLang(locale: string) {
			if (this.locales.includes(locale)) {
				this.locale = locale
			}
		},
		setThemeMode(theme: 'light' | 'dark' | 'new') {
			this.theme = theme
			saveInLocalStorage('theme', theme)
		},
		getThemeMode() {
			if (getInLocalStorage('theme')) {
				this.theme = getInLocalStorage('theme') as 'light' | 'dark' | 'new'
			} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				this.theme = 'dark'
			}
		},
	},
})


