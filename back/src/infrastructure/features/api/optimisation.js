import express from 'express'
import GetAllSubscriptions from '../../../use_cases/get-all-subscriptions'
import DeleteSubscription from '../../../use_cases/delete-subscription'
import DeleteAllArticles from '../../../use_cases/delete-all-articles'
import DeleteArticle from '../../../use_cases/delete-article'
import SynchronizeArticles from '../../../use_cases/synchronize-articles'

const router = express.Router()

router.get('/sub', (req, res) => GetAllSubscriptions.getAllSubscriptions()
  .then(subscriptions => res.status(200).json(subscriptions)))

router.get('/sub/del/:id', (req, res) => {
  const subscriptionId = parseInt(req.params.id, 10)
  return DeleteSubscription.deleteSubscription(subscriptionId)
    .then(() => res.status(204).send())
})

router.get('/art/del', (req, res) => DeleteAllArticles.deleteAllArticles()
  .then(() => res.status(204).send()))

router.get('/art/del/:id', (req, res) => {
  const idArticle = parseInt(req.params.id, 10)
  return DeleteArticle.deleteArticle(idArticle)
    .then(() => res.status(204).send())
})

router.get('/art/delsyn', (req, res) => DeleteAllArticles.deleteAllArticles()
  .then(() => SynchronizeArticles.synchronizeArticles())
  .then(() => res.status(200).json('Success'))
  .catch(err => res.status(500).json('Synchronization failed :', err)))

module.exports = router
