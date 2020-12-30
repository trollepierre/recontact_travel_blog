/* eslint-disable no-console */
import scheduler from 'node-schedule'
import SynchronizeArticles from '../../../use_cases/synchronize-articles'

const EVERY_30_DAYS = '0 0 * */1 *'

scheduler.scheduleJob(EVERY_30_DAYS, () => {
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
