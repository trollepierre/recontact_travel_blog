// Réécrit à l'exécution par le back (back/src/infrastructure/env/static-env.js) quand le build
// statique est servi par Express. Ailleurs (Netlify, dev), ce placeholder reste inerte et le front
// retombe sur les valeurs figées au moment du `nuxi generate`.
window.__ENV__ = window.__ENV__ || {}
