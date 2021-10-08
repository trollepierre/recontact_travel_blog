import express from 'express'
import GetArticlesError from '../../../use_cases/get-articles-error'

const router = express.Router()

router.get('/', (req, res) => GetArticlesError.getAll(req.query)
  .then(articles => res.status(200).json(articles)))

module.exports = router
