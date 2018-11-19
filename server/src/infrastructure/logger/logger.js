const path = require('path');
const morgan = require('morgan');
const rotatingFileStream = require('rotating-file-stream');

// create a rotating write stream
const accessLogStream = rotatingFileStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log'),
});

const logger = morgan('combined', { stream: accessLogStream });

module.exports = logger;
