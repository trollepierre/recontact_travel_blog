import fs from 'fs'
import path from 'path'

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export default function writeStaticEnv() {
  try {
    const distDir = path.resolve(process.cwd(), '..', 'front', 'dist')
    ensureDir(distDir)
    const mapbox = process.env.MAPBOX_TOKEN || ''
    console.log({ mapbox })
    const payload = `window.__ENV__=Object.assign(window.__ENV__||{},${JSON.stringify({ mapboxToken: mapbox })});\n`
    fs.writeFileSync(path.join(distDir, 'env.js'), payload, 'utf8')
  } catch (e) {
    // non fatal
    // eslint-disable-next-line no-console
    console.warn('[env] Failed to write dist/env.js', e && e.message ? e.message : e)
  }
}

