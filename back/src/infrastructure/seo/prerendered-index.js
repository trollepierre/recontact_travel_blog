import fs from 'fs'
import path from 'path'

// Serves a route's prerendered HTML (front/dist/articles/index.html) rather than letting the
// history fallback replace it with the SPA shell.
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
