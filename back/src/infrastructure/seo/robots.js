import { frontDistDir } from '../paths'

const robotsOptions = {
  // Serve robots.txt generated in front/dist during SSG
  root: frontDistDir,
  headers: {
    'Content-Type': 'text/plain;charset=UTF-8',
  },
}

const robots = (req, res) => res.status(200).sendFile('robots.txt', robotsOptions)

module.exports = robots
