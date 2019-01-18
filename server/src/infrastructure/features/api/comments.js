import express from 'express'
import GetComments from '../../../use_cases/get-article-comments'
import AddComment from '../../../use_cases/add-comment'

const router = express.Router()

router.get('/', (req, res) => GetComments.getArticleComments()
  .then(comments => res.json(comments)))

router.post('/', (req, res) => {
  AddComment.addComment(req.body)
    .then(comment => res.json(comment))
    .catch(() => res.status(400).send())
})

module.exports = router
