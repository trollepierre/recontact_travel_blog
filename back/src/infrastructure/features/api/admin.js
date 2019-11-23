import express from 'express'
import UpdateArticle from '../../../use_cases/update-article'
import UpdateArticles from '../../../use_cases/update-articles'

const router = express.Router()

router.patch('/articles/', (req, res) => UpdateArticles.sync(req.body)
  .then(() => res.sendStatus(204)))

router.patch('/articles/:id', (req, res) => UpdateArticle.sync(req.params.id)
  .then(() => res.sendStatus(204)))

module.exports = router
