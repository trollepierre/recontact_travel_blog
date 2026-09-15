import express from 'express'
import GetArticlesMeta from '../../../use_cases/get-articles-meta'

const router = express.Router()

router.get('/', (req, res, next) => GetArticlesMeta.getAll()
  .then(articles => res.status(200).json(articles))
  .catch(next))

module.exports = router
