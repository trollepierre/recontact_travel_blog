import express from 'express'
import GetAllArticles from '../../../use_cases/get-all-articles'
import GetArticle from '../../../use_cases/get-article'
import GetArticlePhotos from '../../../use_cases/get-article-photos'
import GetArticleComments from '../../../use_cases/get-article-comments'
import AddComment from '../../../use_cases/add-comment'

const router = express.Router()

router.get('/', (req, res, next) => GetAllArticles.getAllArticles(req.query.limit)
  .then(articles => res.status(200).json(articles))
  .catch(next))

router.get('/:id', (req, res, next) => GetArticle.getArticle(req.params.id)
  .then(article => res.status(200).json(article))
  .catch(next))

router.get('/:id/photos', (req, res, next) => GetArticlePhotos.getArticlePhotos(req.params.id)
  .then(photos => res.status(200).json(photos))
  .catch(next))

router.get('/:id/comments', (req, res, next) => GetArticleComments.getArticleComments(req.params.id)
  .then(comments => res.status(200).json(comments))
  .catch(next))

router.post('/:id/comments', (req, res) => {
  AddComment.addComment(req.body, req.params.id)
    .then(comment => res.status(201).json(comment))
    .catch(error => res.status(400).send(error))
})

module.exports = router
