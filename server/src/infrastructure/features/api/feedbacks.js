const express = require('express')
const mailService = require('../../../use_cases/send-feedback')

const router = express.Router()

router.post('/', (req, res) => {
  const form = req.body
  mailService.sendFeedbackEmail(form)
    .then(() => {
      res.status(201).json('Feedback sent')
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
})

module.exports = router
