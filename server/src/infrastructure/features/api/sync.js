import express from 'express'
import SynchronizeArticles from '../../../use_cases/synchronize-articles'

const router = express.Router()

router.patch('/', (req, res) => SynchronizeArticles.synchronizeArticles()
  .then(() => {
    console.info('Synchronization successful.')
    res.status(200).json('Synchronization successful.')
  })
  .catch((err) => {
    console.error('Synchronization failed.')
    console.error(err)
    res.status(500).json('Synchronization failed :', err)
  }))

module.exports = router
