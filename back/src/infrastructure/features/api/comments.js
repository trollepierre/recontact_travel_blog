import express from 'express'
import GetAllComments from '../../../use_cases/get-all-comments'
import DeleteComment from '../../../use_cases/delete-comment'

const router = express.Router()

router.get('/', (req, res, next) => GetAllComments.getAllComments()
  .then(comments => res.status(200).json(comments))
  .catch(next))

router.delete('/:id', (req, res, next) => DeleteComment.deleteComment(req.params.id)
  .then(() => res.status(204).send())
  .catch(next))

module.exports = router
