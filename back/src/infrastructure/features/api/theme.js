import express from 'express'
import NotifyTheme from '../../../use_cases/notify-theme'

const router = express.Router()

router.post('/', (req, res, next) => {
  NotifyTheme.notifyTheme(req.body)
    .then(theme => res.status(201).json(theme))
    .catch(next)
})

module.exports = router
