const express = require('express')
const GetLastPosition = require('../../../use_cases/get-last-position')
const AddPosition = require('../../../use_cases/add-position')

const router = express.Router()

router.get('/last', (req, res) => GetLastPosition.getLastPosition()
  .then(position => res.json(position)))

router.post('/', (req, res) => {
  AddPosition.addPosition(req.body)
    .then(position => res.json(position))
    .catch(() => res.status(403).send())
})

module.exports = router
