// Rewritten at runtime by the back (back/src/infrastructure/env/static-env.js) when the static
// build is served by Express. Elsewhere (Netlify, dev) this placeholder stays inert and the front
// falls back to the values frozen at `nuxi generate` time.
window.__ENV__ = window.__ENV__ || {}
