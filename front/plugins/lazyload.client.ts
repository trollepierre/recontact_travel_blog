import VueLazyload from 'vue3-lazyload'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(VueLazyload, {
		error: '',
		loading: '/loader.gif',
	})
})


