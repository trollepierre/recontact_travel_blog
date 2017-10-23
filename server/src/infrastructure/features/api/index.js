const express = require('express');
const SynchronizeArticles = require('../../../use_cases/synchronize-articles');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => SynchronizeArticles.synchronizeArticles()
  .then(() => {
    console.log('Synchronization successful.');
    res.json('Synchronization successful.');
  })
  .catch((err) => {
    console.error('Synchronization failed.');
    console.error(err);
    res.json('Synchronization failed :', err);
  }));

module.exports = router;
