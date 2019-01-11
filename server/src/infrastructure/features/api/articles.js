import express from 'express'
import GetAllArticles from '../../../use_cases/get-all-articles'
import GetArticle from '../../../use_cases/get-article'
import GetPhotosOfArticle from '../../../use_cases/get-photos-of-article'
import GetComments from '../../../use_cases/get-comments'
import AddComment from '../../../use_cases/add-comment'

const router = express.Router()

router.get('/', (req, res) => GetAllArticles.getAllArticles()
  .then(articles => res.json(articles)))

router.get('/:id', (req, res) => GetArticle.getArticle(req.params.id)
  .then(chapters => res.json(chapters)))

router.get('/:id/photos', (req, res) => GetPhotosOfArticle.getAllPhotos(req.params.id)
  .then(photos => res.json(photos)))

router.get('/:id/comments', (req, res) => GetComments.getComments()
  .then(comments => res.json(comments)))

router.post('/:id/comments', (req, res) => {
  AddComment.addComment(req.body)
    .then(comment => res.json(comment))
    .catch(() => res.status(400).send())
})

module.exports = router
