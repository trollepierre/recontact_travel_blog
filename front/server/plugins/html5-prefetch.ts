// Nuxt renders its chunk prefetch hints as `<link rel="prefetch" as="script">`, but `as` is only
// valid alongside `rel="preload"` / `rel="modulepreload"`: the html5v job run in CI reports it as
// an error. Browsers ignore it on `prefetch` anyway, so strip it.
const PREFETCH_AS = /(<link [^>]*rel="prefetch"[^>]*?)\s+as="[^"]*"/g

export default defineNitroPlugin(nitroApp => {
	nitroApp.hooks.hook('render:html', html => {
		html.head = html.head.map(chunk => chunk.replace(PREFETCH_AS, '$1'))
	})
})
