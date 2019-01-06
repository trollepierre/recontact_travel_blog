import express from 'express'
import GetComments from '../../../use_cases/get-comments'
import AddComment from '../../../use_cases/add-comment'

const router = express.Router()

router.get('/', (req, res) => GetComments.getComments()
  .then(comments => res.json(comments)))

router.post('/', (req, res) => {
  console.log('ici')

  AddComment.addComment(req.body)
    .then(comment => res.json(comment))
    .catch(() => res.status(400).send())
})

module.exports = router
