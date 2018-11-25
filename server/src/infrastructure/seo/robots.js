const path = require('path')

const robotsOptions = {
  root: path.join(__dirname, '..', '..', '..', '..', 'client', 'static'),
  headers: {
    'Content-Type': 'text/plain;charset=UTF-8',
  },
}

const robots = (req, res) => (
  res.status(200).sendFile('robots.txt', robotsOptions)
)

module.exports = robots
