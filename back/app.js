import express from 'express'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'

import {
  articles,
  admin,
  comments,
  sync,
  status,
  subscriptions,
  feedbacks,
  positions,
  optimisation,
} from './src/infrastructure/features/api'

import robots from './src/infrastructure/seo/robots'
import sitemap from './src/infrastructure/seo/sitemap'
import history from './src/infrastructure/seo/history'
import env from './src/infrastructure/env/env'

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

app.use('/robots.txt', robots)
app.use('/sitemap.xml', sitemap)
// Should be after robot and sitemap but before dist
app.use(history)

if (env('NODE_ENV') !== 'test') {
  app.use(express.static(path.join(__dirname, '..', '..', 'front', 'dist')))
}

app.use('/status', status)
app.use('/api/sync', sync)
app.use('/api/status', status)
app.use('/api/articles', articles)
app.use('/api/admin/comments', comments)
app.use('/api/admin', admin)
app.use('/api/subscriptions', subscriptions)
app.use('/api/feedbacks', feedbacks)
app.use('/api/positions', positions)
app.use('/apo', optimisation)
app.use('/api/apo', optimisation)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
})

module.exports = app
