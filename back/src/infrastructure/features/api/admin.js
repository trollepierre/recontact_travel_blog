import express from 'express'
import UpdatePhotos from '../../../use_cases/update-photos'
import UpdateChapter from '../../../use_cases/update-chapter'
import UpdateArticle from '../../../use_cases/update-article'
import UpdateArticles from '../../../use_cases/update-articles'

const router = express.Router()

router.patch('/articles/', (req, res) => UpdateArticles.sync(req.body)
  .then(() => res.sendStatus(204)))

router.patch('/articles/:id', (req, res) => UpdateArticle.sync(req.params.id)
  .then(() => res.sendStatus(204)))

router.patch('/articles/:id/chapters/:position', (req, res) => UpdateChapter.sync({
  dropboxId: req.params.id,
  chapterPosition: req.params.position,
})
  .then(() => res.sendStatus(204)))

router.patch('/articles/:id/photos', (req, res) => UpdatePhotos.sync({
  dropboxId: req.params.id,
})
  .then(() => res.sendStatus(204)))

module.exports = router
