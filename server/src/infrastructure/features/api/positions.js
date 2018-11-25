import express from 'express'
import GetLastPosition from '../../../use_cases/get-last-position'
import AddPosition from '../../../use_cases/add-position'

const router = express.Router()

router.get('/last', (req, res) => GetLastPosition.getLastPosition()
  .then(position => res.json(position)))

router.post('/', (req, res) => {
  AddPosition.addPosition(req.body)
    .then(position => res.json(position))
    .catch(() => res.status(403).send())
})

module.exports = router
