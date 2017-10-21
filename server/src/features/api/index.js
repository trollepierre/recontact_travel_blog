const express = require('express');
const dropboxToArticlesService = require('../../domain/services/dropbox-to-articles-service');

const router = express.Router();

/* GET home page. */
router.get('/', () => {
  return dropboxToArticlesService.synchronizeArticles()
    .then(() => {
      console.log('Synchronization successful.');
    })
    .catch((err) => {
      console.error('Synchronization failed');
      console.error(err);
    });
});

module.exports = router;
