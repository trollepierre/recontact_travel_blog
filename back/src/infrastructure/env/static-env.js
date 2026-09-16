import express from 'express'
import env from './env'

const router = express.Router()

// Exposes the dyno configuration to the prerendered front, which is generated once at build time
// and therefore cannot read process.env.
const publicEnv = () => ({
  mapboxToken: env('MAPBOX_TOKEN') || '',
  // '' means "same origin": this Express server serves both /api and front/dist
  apiBase: env('PUBLIC_API_BASE') || '',
})

router.get('/', (req, res) => {
  res.type('application/javascript')
  // Without this, the global cache middleware would freeze these values for 24h in browsers
  res.set('Cache-Control', 'no-store')
  res.send(`window.__ENV__=Object.assign(window.__ENV__||{},${JSON.stringify(publicEnv())});\n`)
})

module.exports = router
