const express = require('express');
const mailService = require('../../../use_cases/mail-service');

const router = express.Router();

router.post('/', (req, res) => {
  const form = req.body;
  mailService.sendFeedbackEmail(form)
    .then(() => {
      res.status(201).json('Feedback sent');
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
