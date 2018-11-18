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

const robots = require('./src/infrastructure/seo/robots')
const sitemap = require('./src/infrastructure/seo/sitemap')
const history = require('./src/infrastructure/seo/history')

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/robots.txt', robots);
app.use('/sitemap.xml', sitemap);
// Should be after robot and sitemap but before dist
app.use(history);

if (process.env.NODE_ENV !== 'test') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
}

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

  res.status(err.status || 500);
});

module.exports = app;
