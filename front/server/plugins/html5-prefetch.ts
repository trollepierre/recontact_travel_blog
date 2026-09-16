// Nuxt rend ses liens de préchargement de chunks avec `<link rel="prefetch" as="script">`, or
// l'attribut `as` n'est valide qu'avec `rel="preload"` / `rel="modulepreload"` : c'est une erreur
// du validateur html5v lancé en CI. Les navigateurs l'ignorent sur `prefetch`, on le retire.
const PREFETCH_AS = /(<link [^>]*rel="prefetch"[^>]*?)\s+as="[^"]*"/g

export default defineNitroPlugin(nitroApp => {
	nitroApp.hooks.hook('render:html', html => {
		html.head = html.head.map(chunk => chunk.replace(PREFETCH_AS, '$1'))
	})
})
