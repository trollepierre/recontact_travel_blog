const injected = () => (typeof window !== 'undefined' && window.__ENV__ ? window.__ENV__ : null)

// Reads a value injected at runtime by the back (/env.js), falling back to the value frozen at
// build time when there is none.
export default (key, fallback) => {
  const values = injected()
  return values && Object.prototype.hasOwnProperty.call(values, key) ? values[key] : fallback
}
