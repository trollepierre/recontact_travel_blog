import express from 'express'
import GetAllArticles from '../../../use_cases/get-all-articles'
import GetArticle from '../../../use_cases/get-article'
import GetArticlePhotos from '../../../use_cases/get-article-photos'
import GetArticleComments from '../../../use_cases/get-article-comments'
import AddComment from '../../../use_cases/add-comment'

const router = express.Router()

router.get('/', (req, res) => GetAllArticles.getAllArticles()
  .then(articles => res.json(articles)))

router.get('/:id', (req, res) => GetArticle.getArticle(req.params.id)
  .then(chapters => res.json(chapters)))

router.get('/:id/photos', (req, res) => GetArticlePhotos.getArticlePhotos(req.params.id)
  .then(photos => res.json(photos)))

router.get('/:id/comments', (req, res) => GetArticleComments.getArticleComments(req.params.id)
  .then(comments => res.json(comments)))

router.post('/:id/comments', (req, res) => {
  AddComment.addComment(req.body, req.params.id)
    .then(comment => res.json(comment))
    .catch(() => res.status(400).send())
})

module.exports = router
