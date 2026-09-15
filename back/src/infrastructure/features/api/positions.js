import express from 'express'
import GetLastPosition from '../../../use_cases/get-last-position'
import AddPosition from '../../../use_cases/add-position'

const router = express.Router()

router.get('/last', (req, res, next) => GetLastPosition.getLastPosition()
  .then(position => res.status(200).json(position))
  .catch(next))

router.post('/', (req, res) => {
  AddPosition.addPosition(req.body)
    .then(position => res.status(201).json(position))
    .catch(() => res.status(403).send())
})

module.exports = router
