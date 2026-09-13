import express from 'express'
import UpdateChapter from '../../../use_cases/update-chapter'
import UpdateArticle from '../../../use_cases/update-article'
import UpdateArticles from '../../../use_cases/update-articles'

const router = express.Router()

// without the catch, a rejected sync becomes an unhandled rejection and node
// exits: one unreadable dropbox answer took the whole server down, and the
// browser saw it as a CORS error because a dead dyno returns no headers at all
router.patch('/articles/', (req, res, next) => UpdateArticles.sync(req.body)
  .then(() => res.sendStatus(204))
  .catch(next))

router.patch('/articles/:id', (req, res, next) => UpdateArticle.sync(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(next))

router.patch('/articles/:id/chapters/:position', (req, res, next) => UpdateChapter.sync({
  dropboxId: req.params.id,
  chapterPosition: req.params.position,
})
  .then(() => res.sendStatus(204))
  .catch(next))

module.exports = router
