const express = require('express');
const GetLastPosition = require('../../../use_cases/get-last-position');

const router = express.Router();

router.get('/last', (req, res) => GetLastPosition.getLastPosition()
  .then(position => res.json(position)));

// router.post('/', (req, res) => {
//   const form = req.body;
//   mailService.sendFeedbackEmail(form)
//     .then(() => {
//       res.status(201).json('Feedback sent');
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err });
//     });
// });

module.exports = router;
