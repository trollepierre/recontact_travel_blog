export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive('lazy', {
		getSSRProps(binding) {
			const raw = binding?.value
			if (!raw) return {}
			const url = String(raw)
			if (binding?.arg === 'background-image') {
				return { style: `background-image: url(${url})` }
			}
			return { src: url, 'data-ssr-lazy': 'true' }
		},
	})
})

