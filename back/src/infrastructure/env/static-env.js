import express from 'express'
import env from './env'

const router = express.Router()

// Expose la configuration du dyno au front prérendu, qui est généré une fois au build et ne peut
// donc pas lire process.env.
const publicEnv = () => ({
  mapboxToken: env('MAPBOX_TOKEN') || '',
  // '' signifie « même origine » : ce serveur Express sert à la fois /api et front/dist
  apiBase: env('PUBLIC_API_BASE') || '',
})

router.get('/', (req, res) => {
  res.type('application/javascript')
  // Sans cela le middleware de cache global figerait ces valeurs pour 24h dans les navigateurs
  res.set('Cache-Control', 'no-store')
  res.send(`window.__ENV__=Object.assign(window.__ENV__||{},${JSON.stringify(publicEnv())});\n`)
})

module.exports = router
