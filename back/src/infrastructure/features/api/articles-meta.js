import express from 'express'
import GetArticlesMeta from '../../../use_cases/get-articles-meta'

const router = express.Router()

router.get('/', (req, res) => GetArticlesMeta.getAll()
  .then(articles => res.status(200).json(articles)))

module.exports = router
