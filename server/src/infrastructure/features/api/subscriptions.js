const express = require('express');
const Subscribe = require('../../../use_cases/subscribe');

const router = express.Router();

router.post('/', (req, res) => {
  console.log('welcome in subscription');
  console.log(req.body);
  const { email, lang } = req.body;
  console.log(email);
  console.log(lang);

  return Subscribe.subscribe({ email, lang })
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
