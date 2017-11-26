const express = require('express');
const GetAllSubscriptions = require('../../../use_cases/get-all-subscriptions');
const DeleteSubscription = require('../../../use_cases/delete-subscription');
const DeleteAllArticles = require('../../../use_cases/delete-all-articles');
const DeleteArticle = require('../../../use_cases/delete-article');
const SynchronizeArticles = require('../../../use_cases/synchronize-articles');

const router = express.Router();

router.get('/sub', (req, res) => GetAllSubscriptions.getAllSubscriptions()
  .then(subscriptions => res.status(200).json(subscriptions)));

router.get('/sub/del/:id', (req, res) => {
  const subscriptionId = parseInt(req.params.id, 10);
  return DeleteSubscription.deleteSubscription(subscriptionId)
    .then(() => res.status(204).send());
});

router.get('/art/del', (req, res) => DeleteAllArticles.deleteAllArticles()
  .then(() => res.status(204).send()));

router.get('/art/del/:id', (req, res) => {
  const articleId = parseInt(req.params.id, 10);
  return DeleteArticle.deleteArticle(articleId)
    .then(() => res.status(204).send());
});

router.get('/art/del/syn', (req, res) => DeleteAllArticles.deleteAllArticles()
  .then(() => SynchronizeArticles.synchronizeArticles())
  .then(() => res.status(200).json('Success'))
  .catch(err => res.status(500).json('Synchronization failed :', err)));


module.exports = router;
