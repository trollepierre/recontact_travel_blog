const express = require('express');
const Subscribe = require('../../../use_cases/subscribe');

const router = express.Router();

router.post('/', (req, res) => {
  Subscribe.subscribe(req.body)
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

module.exports = router;
