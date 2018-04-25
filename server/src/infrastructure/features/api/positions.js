const express = require('express');
const GetLastPosition = require('../../../use_cases/get-last-position');
const SetPosition = require('../../../use_cases/set-position');

const router = express.Router();

router.get('/last', (req, res) => GetLastPosition.getLastPosition()
  .then(position => res.json(position)));

router.post('/', (req, res) => {
  SetPosition.setPosition(req.body)
    .then(position => res.json(position))
    .catch(() => res.status(403).send());
});


module.exports = router;
