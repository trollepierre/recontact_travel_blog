const injected = () => (typeof window !== 'undefined' && window.__ENV__ ? window.__ENV__ : null)

// Lit une valeur injectée à l'exécution par le back (/env.js), et retombe sur la valeur figée au
// build quand il n'y en a pas.
export default (key, fallback) => {
  const values = injected()
  return values && Object.prototype.hasOwnProperty.call(values, key) ? values[key] : fallback
}
