/* eslint-disable no-console */
const scheduler = require('node-schedule');
const dropboxToArticlesService = require('../../domain/services/dropbox-to-articles-service');

const EVERY_15_MINUTES = '*/15 * * * *';

scheduler.scheduleJob(EVERY_15_MINUTES, () => {
  console.log('Synchronize dropboxToArticless from Octopod...');

  return dropboxToArticlesService.synchronizeArticles()
    .then(() => {
      console.log('Synchronization successful.');
    })
    .catch((err) => {
      console.error('Synchronization failed');
      console.error(err);
    });
});

// TODO find a way to test this (unit or integration) :-/
