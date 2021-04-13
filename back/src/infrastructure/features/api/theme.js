import express from 'express'
import NotifyTheme from '../../../use_cases/notify-theme'

const router = express.Router()

router.post('/', (req, res) => {
  NotifyTheme.notifyTheme(req.body)
    .then(theme => res.status(201).json(theme))
})

module.exports = router
