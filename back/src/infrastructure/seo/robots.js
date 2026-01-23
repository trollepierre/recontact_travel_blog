import path from 'path'

const robotsOptions = {
  // Serve robots.txt generated in front/dist during SSG
  root: path.resolve(process.cwd(), '..', 'front', 'dist'),
  headers: {
    'Content-Type': 'text/plain;charset=UTF-8',
  },
}

const robots = (req, res) => res.status(200).sendFile('robots.txt', robotsOptions)

module.exports = robots
