const express = require('express');
const GetAllSubscriptions = require('../../../use_cases/get-all-subscriptions');
const Subscribe = require('../../../use_cases/subscribe');
const DeleteSubscription = require('../../../use_cases/delete-subscription');

const router = express.Router();

router.get('/', (req, res) => GetAllSubscriptions.getAllSubscriptions()
  .then(subscriptions => res.json(subscriptions)));

router.post('/', (req, res) => {
  const email = req.body.email;
  const lang = req.body.lang;

  Subscribe.subscribe({ email, lang })
    .then(({ subscription, created }) => {
      if (created) {
        res.status(201);
      }
      res.json(subscription);
    })
    .catch(() => {
      res.status(403).send();
    });
});

router.delete('/:id', (req, res) => {
  const subscriptionId = parseInt(req.params.id, 10);
  DeleteSubscription.deleteSubscription(subscriptionId)
    .then(() => res.status(204).send());
});

module.exports = router;
