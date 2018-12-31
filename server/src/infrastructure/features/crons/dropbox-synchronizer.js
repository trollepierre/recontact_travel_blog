/* eslint-disable no-console */
import scheduler from 'node-schedule'
import SynchronizeArticles from '../../../use_cases/synchronize-articles'

const EVERY_15_MINUTES = '*/15 * * * *'

scheduler.scheduleJob(EVERY_15_MINUTES, () => {
  console.info('Synchronize Articles from Dropbox...')

  return SynchronizeArticles.synchronizeArticles()
    .then(() => {
      console.info('Synchronization successful.')
    })
    .catch(err => {
      console.error('Synchronization failed')
      console.error(err)
    })
})

// TODO find a way to test this (unit or integration) :-/
