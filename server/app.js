const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const articles = require('./src/infrastructure/features/api/articles');
const admin = require('./src/infrastructure/features/api/admin');
const sync = require('./src/infrastructure/features/api/sync');
const subscriptions = require('./src/infrastructure/features/api/subscriptions');
const feedbacks = require('./src/infrastructure/features/api/feedbacks');
const positions = require('./src/infrastructure/features/api/positions');
const optimisation = require('./src/infrastructure/features/api/optimisation');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// static resources
// FIXME manage better environment variables
if (process.env.NODE_ENV !== 'test') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
}

const robotsOptions = {
  root: path.join(__dirname, '..', 'client', 'static'),
  headers: {
    'Content-Type': 'text/plain;charset=UTF-8',
  },
};
app.use('/robots.txt', (req, res) => (
  res.status(200).sendFile('robots.txt', robotsOptions)
));

const sitemapOptions = {
  root: path.join(__dirname, '..', 'client', 'static'),
  headers: {
    'Content-Type': 'text/xml;charset=UTF-8',
  },
};
app.use('/sitemap.xml', (req, res) => (
  res.status(200).sendFile('sitemap.xml', sitemapOptions)
));

app.use('/sitemap.xml', express.static(path.join(__dirname, '..', 'client', 'static', 'sitemap')));
app.use('/api/sync', sync);
app.use('/api/articles', articles);
app.use('/api/admin', admin);
app.use('/api/subscriptions', subscriptions);
app.use('/api/feedbacks', feedbacks);
app.use('/api/positions', positions);
app.use('/apo', optimisation);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
