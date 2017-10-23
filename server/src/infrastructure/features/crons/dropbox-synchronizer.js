/* eslint-disable no-console */
const scheduler = require('node-schedule');
const SynchronizeArticles = require('../../../use_cases/synchronize-articles');

const EVERY_15_MINUTES = '*/15 * * * *';

scheduler.scheduleJob(EVERY_15_MINUTES, () => {
  console.log('Synchronize Articles from Dropbox...');

  return SynchronizeArticles.synchronizeArticles()
    .then(() => {
      console.log('Synchronization successful.');
    })
    .catch((err) => {
      console.error('Synchronization failed');
      console.error(err);
    });
});

// TODO find a way to test this (unit or integration) :-/
