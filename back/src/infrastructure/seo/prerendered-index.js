import fs from 'fs'
import path from 'path'

// Sert le HTML prérendu d'une route (front/dist/articles/index.html) plutôt que de laisser le
// history fallback la remplacer par le shell SPA.
const prerenderedIndex = distDir => (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next()
  }
  const candidate = path.join(distDir, req.path, 'index.html')
  if (candidate.startsWith(`${distDir}${path.sep}`) && fs.existsSync(candidate)) {
    req.url = path.posix.join(req.path, 'index.html')
  }
  return next()
}

module.exports = prerenderedIndex
